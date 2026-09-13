import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../../src/theme';
import { ProofHeader, BeforeAfterSlider, Button } from '../../src/components';
import { DEMO_EVIDENCE, DEMO_AI_INSIGHTS } from '../../src/services/demoData';

export default function BeforeAfterComparisonScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const beforeImage = DEMO_EVIDENCE[0].image_url;
  const afterImage = DEMO_EVIDENCE[4].image_url;

  return (
    <View style={styles.screen}>
      <ProofHeader
        title="Proof"
        subtitle="Retrospect"
        showBack
        onBack={() => router.back()}
        dayLabel="DAY 30"
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <View style={styles.synthesisBadge}>
            <MaterialIcons name="auto-awesome" size={14} color={colors.secondary} />
            <Text style={styles.synthesisText}>MILESTONE SYNTHESIS</Text>
          </View>
          <Text style={styles.headline}>Look at the difference.</Text>
          <Text style={styles.subtitle}>30 days of deliberate practice in Digital Art.</Text>
        </View>

        {/* Cinematic Draggable Comparison Slider */}
        <View style={styles.sliderWrapper}>
          <BeforeAfterSlider
            beforeImage={beforeImage}
            afterImage={afterImage}
            beforeLabel="DAY 1 · Aug 1"
            afterLabel="DAY 30 · Aug 30"
            aspectRatio={4 / 5}
          />
        </View>

        {/* 4-Grid Metrics Cards */}
        <View style={styles.metricsGrid}>
          {/* Span */}
          <View style={[styles.metricCard, shadows.level1]}>
            <View style={styles.metricCardHeader}>
              <Text style={styles.metricCardLabel}>SPAN</Text>
              <MaterialIcons name="calendar-today" size={16} color={colors.secondary} />
            </View>
            <Text style={styles.metricCardValue}>30 Days</Text>
            <Text style={styles.metricCardSub}>Elapsed practice</Text>
          </View>

          {/* Logged */}
          <View style={[styles.metricCard, shadows.level1]}>
            <View style={styles.metricCardHeader}>
              <Text style={styles.metricCardLabel}>LOGGED</Text>
              <MaterialIcons name="photo-library" size={16} color={colors.secondary} />
            </View>
            <Text style={styles.metricCardValue}>12 Entries</Text>
            <Text style={styles.metricCardSub}>Evidence proof points</Text>
          </View>

          {/* Pivots */}
          <View style={[styles.metricCard, shadows.level1]}>
            <View style={styles.metricCardHeader}>
              <Text style={styles.metricCardLabel}>PIVOTS</Text>
              <MaterialIcons name="flag" size={16} color={colors.secondary} />
            </View>
            <Text style={styles.metricCardValue}>4 Milestones</Text>
            <Text style={styles.metricCardSub}>Key breakthrough marks</Text>
          </View>

          {/* Effort */}
          <View style={[styles.metricCard, shadows.level1]}>
            <View style={styles.metricCardHeader}>
              <Text style={styles.metricCardLabel}>EFFORT</Text>
              <MaterialIcons name="timer" size={16} color={colors.secondary} />
            </View>
            <Text style={styles.metricCardValue}>18.5 Hrs</Text>
            <Text style={styles.metricCardSub}>Total deliberate focus</Text>
          </View>
        </View>

        {/* Grounded "What Changed?" Card */}
        <View style={[styles.whatChangedCard, shadows.level1]}>
          <View style={styles.whatChangedHeader}>
            <View style={styles.whatChangedIconCircle}>
              <MaterialIcons name="psychology" size={16} color={colors.secondary} />
            </View>
            <Text style={styles.whatChangedTitle}>What Changed?</Text>
            <View style={styles.groundedPill}>
              <Text style={styles.groundedPillText}>Grounded in 12 entries</Text>
            </View>
          </View>

          <Text style={styles.whatChangedBody}>
            Your earlier entries focused on basic outline geometry. Starting <Text style={styles.boldText}>Day 15</Text>, your reflections shifted toward lighting composition and color theory, leading directly to the volumetric depth in <Text style={styles.boldText}>Day 30</Text>.
          </Text>

          <View style={styles.trajectoryRow}>
            <View style={styles.trajectoryDot} />
            <Text style={styles.trajectoryText}>
              Growth trajectory: {DEMO_AI_INSIGHTS.growth_trajectory}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsBox}>
          <Button
            title="Generate Proof Story"
            onPress={() => router.push('/(tabs)/stories')}
            variant="aurora"
            icon={<MaterialIcons name="movie" size={20} color="#FFFFFF" />}
            iconPosition="left"
          />
          <Button
            title="Export Comparison Card"
            onPress={() => Alert.alert('Export Comparison', 'Comparison card ready for sharing.')}
            variant="secondary"
            icon={<MaterialIcons name="share" size={18} color={colors.onSurface} />}
            iconPosition="left"
          />
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
  headerBlock: {
    marginBottom: 16,
  },
  synthesisBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  synthesisText: {
    ...typography.labelCaps,
    color: colors.secondary,
  },
  headline: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  sliderWrapper: {
    marginBottom: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 18,
    padding: 14,
    justifyContent: 'space-between',
    minHeight: 100,
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricCardLabel: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  metricCardValue: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginTop: 8,
  },
  metricCardSub: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  whatChangedCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    gap: 10,
  },
  whatChangedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whatChangedIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatChangedTitle: {
    ...typography.headlineSm,
    fontSize: 15,
    color: colors.onSurface,
    flex: 1,
  },
  groundedPill: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  groundedPillText: {
    ...typography.monoMetric,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  whatChangedBody: {
    ...typography.bodyMd,
    color: colors.onSurface,
    lineHeight: 21,
  },
  boldText: {
    fontWeight: '700',
    color: colors.onSurface,
  },
  trajectoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  trajectoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  trajectoryText: {
    ...typography.monoMetric,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  actionsBox: {
    gap: 10,
    marginBottom: 24,
  },
});
