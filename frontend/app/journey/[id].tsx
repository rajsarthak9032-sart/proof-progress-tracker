import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../../src/theme';
import { ProofHeader, EvidenceCard, BeforeAfterSlider } from '../../src/components';
import { DEMO_JOURNEYS, DEMO_EVIDENCE, DEMO_MILESTONES } from '../../src/services/demoData';

export default function JourneyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const journey = DEMO_JOURNEYS.find((j) => j.id === id) || DEMO_JOURNEYS[0];
  const [selectedDay, setSelectedDay] = useState<number>(30);

  return (
    <View style={styles.screen}>
      <ProofHeader
        title={journey.title}
        subtitle="Journey Detail"
        showBack
        onBack={() => router.back()}
        dayLabel={`DAY ${journey.current_day}`}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 96 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Category & Status Badges */}
        <View style={styles.categoryRow}>
          <View style={styles.categoryPill}>
            <MaterialIcons name="palette" size={14} color={colors.onSurfaceVariant} />
            <Text style={styles.categoryText}>Visual Arts & Illustration</Text>
          </View>
          <View style={styles.activePill}>
            <View style={styles.pulseDot} />
            <Text style={styles.activeText}>Active Track</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.journeyTitle}>{journey.title}</Text>
          <Text style={styles.journeyMeta}>
            30 days of proof · 12 recorded evidence pieces
          </Text>
        </View>

        {/* Hero Artwork Preview Card */}
        <View style={[styles.heroArtworkCard, shadows.level2]}>
          <View style={styles.artworkImageBox}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxzsJbZ3fyRnQzhFJJszTK49JoJ7iqoQX5Mtqx2jUr3JfM7INbF_u8WmmuD_pX6XNOBPCsxCLwPNKGCnXWchcbaPbJq87acGStaVyK4WSUhRAK4ZWd1GA_501cKMuJM6a7uWIJrzJNHCx6aa7CRYdxI67c6vXqXaRnoLFnYoP56iihDd49NvnnzpP8bxuYn0plRNT-6VPu4LzhDokeM2_QYjI_VovVf2zhCNSMF_x4KzKXpG_G4Dnrzw',
              }}
              style={styles.artworkImage}
              resizeMode="cover"
            />
            <View style={styles.artworkScrim} />

            {/* Top Floating Badge */}
            <View style={styles.topArtworkBadge}>
              <View style={styles.artworkDot} />
              <Text style={styles.artworkBadgeText}>Day 30 (Latest) — Aug 30</Text>
            </View>

            {/* Bottom Metadata */}
            <View style={styles.bottomArtworkRow}>
              <View>
                <Text style={styles.artworkOpusLabel}>MILESTONE OPUS</Text>
                <Text style={styles.artworkOpusTitle}>Sanctuary of Luminescence</Text>
              </View>
              <View style={styles.artworkHoursPill}>
                <MaterialIcons name="timer" size={14} color="#FFFFFF" />
                <Text style={styles.artworkHoursText}>42h total</Text>
              </View>
            </View>
          </View>

          {/* Comparison Micro-strip Banner */}
          <View style={styles.comparisonBanner}>
            <View style={styles.bannerLeft}>
              <View style={styles.bannerIconCircle}>
                <MaterialIcons name="auto-awesome" size={14} color={colors.secondaryContainer} />
              </View>
              <Text style={styles.bannerText}>30-day architectural leap confirmed</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push(`/compare/${journey.id}` as any)}
              style={styles.compareBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.compareBtnText}>Compare D1</Text>
              <MaterialIcons name="arrow-forward" size={14} color={colors.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Visual Evidence Timeline Section */}
        <View style={styles.timelineSection}>
          <View style={styles.timelineHeader}>
            <View style={styles.timelineHeaderLeft}>
              <Text style={styles.timelineTitle}>Evidence Timeline</Text>
              <View style={styles.timelineCountPill}>
                <Text style={styles.timelineCountText}>5 key captures</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/time-travel')}
              style={styles.scrubViewBtn}
              activeOpacity={0.8}
            >
              <MaterialIcons name="tune" size={16} color={colors.secondary} />
              <Text style={styles.scrubViewText}>Scrub View</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Scrollable Evidence Track */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalTrackContent}
          >
            {DEMO_EVIDENCE.map((ev) => (
              <EvidenceCard
                key={ev.id}
                evidence={ev}
                isActive={selectedDay === ev.day_number}
                onPress={() => {
                  setSelectedDay(ev.day_number);
                  router.push('/(tabs)/time-travel');
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Interactive Before & After Quick Comparison Card */}
        <View style={styles.quickCompareCard}>
          <View style={styles.quickCompareHeader}>
            <View style={styles.quickCompareLeft}>
              <MaterialIcons name="compare" size={20} color={colors.secondary} />
              <Text style={styles.quickCompareTitle}>30-Day Retrospective Shift</Text>
            </View>
            <View style={styles.quickCompareTag}>
              <Text style={styles.quickCompareTagText}>Day 1 vs Day 30</Text>
            </View>
          </View>

          <BeforeAfterSlider
            beforeImage={DEMO_EVIDENCE[0].image_url}
            afterImage={DEMO_EVIDENCE[4].image_url}
            beforeLabel="D1 Charcoal Sphere"
            afterLabel="D30 Sanctuary"
            aspectRatio={16 / 9}
          />
        </View>

        {/* Milestones Section */}
        <View style={styles.milestonesSection}>
          <View style={styles.milestonesHeader}>
            <View>
              <Text style={styles.milestonesTitle}>Milestones</Text>
              <Text style={styles.milestonesSub}>The quiet transformations in technique</Text>
            </View>
            <View style={styles.milestonesRealizedPill}>
              <Text style={styles.milestonesRealizedText}>4 / 4 Realized</Text>
            </View>
          </View>

          <View style={styles.milestonesList}>
            {DEMO_MILESTONES.map((ms) => (
              <View key={ms.id} style={[styles.milestoneItem, shadows.level1]}>
                <View style={styles.milestoneCheckCircle}>
                  <MaterialIcons name="check-circle" size={16} color={colors.secondary} />
                </View>
                <View style={styles.milestoneTextCol}>
                  <View style={styles.milestoneTopRow}>
                    <Text style={styles.milestoneItemTitle}>{ms.title}</Text>
                    <Text style={styles.milestoneDayTag}>Day {ms.day_number}</Text>
                  </View>
                  <Text style={styles.milestoneItemDesc}>{ms.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Sticky Bottom Actions */}
      <View style={[styles.floatingDock, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/time-travel')}
          style={[styles.dockTimeTravelBtn, shadows.level2]}
          activeOpacity={0.88}
        >
          <MaterialIcons name="history" size={20} color={colors.secondary} />
          <Text style={styles.dockTimeTravelText}>Time Travel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/evidence/add?journey_id=${journey.id}` as any)}
          style={[styles.dockAddEvidenceBtn, shadows.level2]}
          activeOpacity={0.88}
        >
          <MaterialIcons name="photo-camera" size={20} color="#FFFFFF" />
          <Text style={styles.dockAddEvidenceText}>+ Add Evidence</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 14,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  categoryText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondaryContainer,
  },
  activeText: {
    ...typography.monoMetric,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  titleBlock: {
    marginBottom: 16,
  },
  journeyTitle: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  journeyMeta: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  heroArtworkCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerLowest,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  artworkImageBox: {
    width: '100%',
    aspectRatio: 4 / 3,
    position: 'relative',
    backgroundColor: colors.surfaceContainerHigh,
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  artworkScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  topArtworkBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  artworkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  artworkBadgeText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.onSurface,
    fontWeight: '700',
  },
  bottomArtworkRow: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  artworkOpusLabel: {
    ...typography.labelCaps,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 9,
  },
  artworkOpusTitle: {
    ...typography.headlineSm,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  artworkHoursPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  artworkHoursText: {
    ...typography.monoMetric,
    fontSize: 11,
    color: '#FFFFFF',
  },
  comparisonBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  bannerIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontWeight: '500',
    fontSize: 12,
  },
  compareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compareBtnText: {
    ...typography.labelCaps,
    color: colors.secondary,
    fontWeight: '700',
  },
  timelineSection: {
    marginBottom: 24,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },
  timelineCountPill: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  timelineCountText: {
    ...typography.monoMetric,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  scrubViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scrubViewText: {
    ...typography.labelCaps,
    color: colors.secondary,
  },
  horizontalTrackContent: {
    paddingVertical: 6,
  },
  quickCompareCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  quickCompareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickCompareLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickCompareTitle: {
    ...typography.headlineSm,
    fontSize: 15,
    color: colors.onSurface,
  },
  quickCompareTag: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  quickCompareTagText: {
    ...typography.monoMetric,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  milestonesSection: {
    marginBottom: 24,
  },
  milestonesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  milestonesTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },
  milestonesSub: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  milestonesRealizedPill: {
    backgroundColor: colors.secondaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  milestonesRealizedText: {
    ...typography.monoMetric,
    fontSize: 11,
    color: colors.onSecondaryFixed,
    fontWeight: '700',
  },
  milestonesList: {
    gap: 10,
  },
  milestoneItem: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 18,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  milestoneCheckCircle: {
    marginTop: 2,
  },
  milestoneTextCol: {
    flex: 1,
  },
  milestoneTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneItemTitle: {
    ...typography.headlineSm,
    fontSize: 14,
    color: colors.onSurface,
  },
  milestoneDayTag: {
    ...typography.monoMetric,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  milestoneItemDesc: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 17,
  },
  floatingDock: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
    zIndex: 100,
  },
  dockTimeTravelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 18,
    height: 52,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.06)',
  },
  dockTimeTravelText: {
    ...typography.headlineSm,
    fontSize: 13,
    color: colors.onSurface,
    fontWeight: '600',
  },
  dockAddEvidenceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 9999,
  },
  dockAddEvidenceText: {
    ...typography.headlineSm,
    fontSize: 14,
    color: colors.onPrimary,
    fontWeight: '600',
  },
});
