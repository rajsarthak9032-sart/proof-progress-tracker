import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../../src/theme';
import { ProofHeader, EmptyState, LoadingState } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { usePurchases } from '../../src/context/PurchasesContext';
import { api } from '../../src/services/api';
import { DEMO_JOURNEYS } from '../../src/services/demoData';
import { Journey } from '../../src/types';

export default function HomeJourneysScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDemoMode } = useAuth();
  const { isPro } = usePurchases();

  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadJourneys = useCallback(async () => {
    if (isDemoMode) {
      setJourneys(DEMO_JOURNEYS);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const data = await api.getJourneys();
      setJourneys(data);
    } catch {
      setJourneys([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isDemoMode]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadJourneys();
  }, [loadJourneys]);

  const onRefresh = () => {
    setRefreshing(true);
    loadJourneys();
  };

  const handleCreateJourney = () => {
    // Check free tier limits
    if (!isPro && journeys.length >= 1 && !isDemoMode) {
      router.push('/paywall');
      return;
    }
    router.push('/journey/create');
  };

  const activeJourneysCount = journeys.filter((j) => j.is_active).length;

  return (
    <View style={styles.screen}>
      <ProofHeader
        title="Proof"
        subtitle="Journeys"
        dayLabel="DAY 30"
        onProfilePress={() => router.push('/(tabs)/profile')}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 96 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.secondary} />
        }
      >
        {/* Progress Header Meta */}
        <View style={styles.headerMetaRow}>
          <View>
            <Text style={styles.headerTitle}>Your Progress</Text>
            <Text style={styles.headerSubtitle}>Every journey leaves evidence.</Text>
          </View>
          <View style={styles.activePill}>
            <View style={styles.activeDot} />
            <Text style={styles.activePillText}>
              {activeJourneysCount} Active
            </Text>
          </View>
        </View>

        {loading ? (
          <LoadingState message="Loading your journeys..." />
        ) : journeys.length === 0 ? (
          <EmptyState
            title="You haven't started a Journey yet."
            description="Proof turns the small moments you record into a quiet, undeniable story of how far you've come."
            actionTitle="Start something worth remembering"
            onAction={handleCreateJourney}
          />
        ) : (
          <View style={styles.cardsList}>
            {journeys.map((journey, idx) => {
              const isDigitalArt = journey.id.includes('art');
              const imageUri =
                journey.latest_evidence?.image_url ||
                (isDigitalArt
                  ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxzsJbZ3fyRnQzhFJJszTK49JoJ7iqoQX5Mtqx2jUr3JfM7INbF_u8WmmuD_pX6XNOBPCsxCLwPNKGCnXWchcbaPbJq87acGStaVyK4WSUhRAK4ZWd1GA_501cKMuJM6a7uWIJrzJNHCx6aa7CRYdxI67c6vXqXaRnoLFnYoP56iihDd49NvnnzpP8bxuYn0plRNT-6VPu4LzhDokeM2_QYjI_VovVf2zhCNSMF_x4KzKXpG_G4Dnrzw'
                  : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbXU_Zg9a2XLBgkDVOx2zkyBKrGIwrcUI7F0-sgXHqn6Hm_T-ZOfg1-mOQj2qbTKEd_lOdalKfWRGYfzI6sQ9N_7clUduNuhmyyxVtmwhWpn2jpFWHoyPXEIwMp5QFIE9HAD2P-lQ0JGWGlLYIPac033r0tWyK-MQfJqPNXxM_NBu9XOfekUl2xgK6_R3BH3dcvAF2kddaWSd_3uTCfAnw72ZD5v2NrQhQiRGzSqVnikLafDXs0pY6ng');

              return (
                <TouchableOpacity
                  key={journey.id}
                  activeOpacity={0.95}
                  onPress={() => router.push(`/journey/${journey.id}` as any)}
                  style={[styles.journeyCard, shadows.level1]}
                >
                  {/* Aspect ratio visual media */}
                  <View style={[styles.imageContainer, { aspectRatio: idx === 0 ? 16 / 11 : 16 / 9 }]}>
                    <Image source={{ uri: imageUri }} style={styles.cardImage} resizeMode="cover" />
                    <View style={styles.imageOverlay} />

                    {/* Top Badges */}
                    <View style={styles.topBadgesRow}>
                      <View style={styles.dayPill}>
                        <View style={styles.dayPillDot} />
                        <Text style={styles.dayPillText}>
                          DAY {journey.current_day} OF {journey.duration_days}
                        </Text>
                      </View>
                      <View style={styles.goalPill}>
                        <Text style={styles.goalPillText}>
                          {journey.current_day >= journey.duration_days ? 'GOAL REACHED' : 'IN PROGRESS'}
                        </Text>
                      </View>
                    </View>

                    {/* Bottom Title on Image */}
                    <View style={styles.imageBottomRow}>
                      <View style={styles.titleInfoCol}>
                        <Text numberOfLines={1} style={styles.cardTitle}>{journey.title}</Text>
                        <Text style={styles.cardSubtitle}>{journey.description || 'Deliberate practice series'}</Text>
                      </View>
                      <View style={styles.inspectBtn}>
                        <MaterialIcons name="fullscreen" size={20} color="#FFFFFF" />
                      </View>
                    </View>
                  </View>

                  {/* Discrete Waypoint Progress Track */}
                  <View style={styles.cardBody}>
                    <View style={styles.waypointHeader}>
                      <Text style={styles.waypointLabel}>Key Waypoints (5 of 5)</Text>
                      <Text style={styles.waypointPercent}>100%</Text>
                    </View>

                    {/* Discrete dots row */}
                    <View style={styles.dotsRow}>
                      {['D1', 'D7', 'D14', 'D21', 'D30'].map((d, dIdx) => (
                        <View key={d} style={styles.dotCol}>
                          <View
                            style={[
                              styles.dotTrack,
                              dIdx === 4 && styles.activeDotTrack,
                            ]}
                          />
                          <Text
                            style={[
                              styles.dotText,
                              dIdx === 4 && styles.activeDotText,
                            ]}
                          >
                            {d}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Evidence Metadata Strip */}
                    <View style={styles.metaStrip}>
                      <View style={styles.metaLeft}>
                        <View style={styles.metaItem}>
                          <MaterialIcons name="photo-library" size={16} color={colors.secondary} />
                          <Text style={styles.metaText}>{journey.evidence_count} evidence</Text>
                        </View>
                        <Text style={styles.metaDot}>•</Text>
                        <View style={styles.metaItem}>
                          <MaterialIcons name="flag" size={16} color={colors.onSurfaceVariant} />
                          <Text style={styles.metaText}>{journey.milestone_count} milestones</Text>
                        </View>
                      </View>
                      <Text style={styles.metaDate}>Aug 1</Text>
                    </View>

                    {/* Scrub in Time Travel CTA */}
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => router.push('/(tabs)/time-travel')}
                      style={styles.scrubActionBtn}
                    >
                      <View style={styles.scrubActionLeft}>
                        <MaterialIcons name="history-toggle-off" size={18} color={colors.secondary} />
                        <Text style={styles.scrubActionText}>Scrub in Time Travel</Text>
                      </View>
                      <MaterialIcons name="arrow-forward" size={18} color={colors.secondary} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Docked New Journey Button */}
            <View style={styles.newJourneyRow}>
              <TouchableOpacity
                onPress={handleCreateJourney}
                activeOpacity={0.88}
                style={[styles.newJourneyBtn, shadows.level2]}
              >
                <MaterialIcons name="add" size={20} color={colors.secondaryContainer} />
                <Text style={styles.newJourneyBtnText}>New Journey</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    paddingTop: 16,
  },
  headerMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  headerTitle: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  headerSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondaryContainer,
  },
  activePillText: {
    ...typography.monoMetric,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  cardsList: {
    gap: 20,
  },
  journeyCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: colors.surfaceContainerHigh,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 5,
  },
  dayPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondaryContainer,
  },
  dayPillText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.onSurface,
  },
  goalPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  goalPillText: {
    ...typography.monoMetric,
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  imageBottomRow: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  titleInfoCol: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    ...typography.headlineMd,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cardSubtitle: {
    ...typography.monoMetric,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.82)',
    marginTop: 2,
  },
  inspectBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: 18,
    backgroundColor: colors.surfaceContainerLowest,
  },
  waypointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  waypointLabel: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
  },
  waypointPercent: {
    ...typography.monoMetric,
    color: colors.onSurface,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 6,
  },
  dotCol: {
    flex: 1,
    alignItems: 'center',
  },
  dotTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondaryContainer,
  },
  activeDotTrack: {
    backgroundColor: colors.secondary,
  },
  dotText: {
    ...typography.monoMetric,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  activeDotText: {
    color: colors.secondary,
    fontWeight: '700',
  },
  metaStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.monoMetric,
    fontSize: 11,
    color: colors.onSurface,
  },
  metaDot: {
    color: colors.outlineVariant,
  },
  metaDate: {
    ...typography.monoMetric,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  scrubActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(253, 106, 73, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9999,
    marginTop: 14,
  },
  scrubActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scrubActionText: {
    ...typography.headlineSm,
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '600',
  },
  newJourneyRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  newJourneyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 9999,
  },
  newJourneyBtnText: {
    ...typography.headlineSm,
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});
