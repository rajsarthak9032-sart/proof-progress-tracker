import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../../src/theme';
import { Button, BeforeAfterSlider } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setDemoMode } = useAuth();

  const handleStartJourney = () => {
    router.replace('/(auth)/login');
  };

  const handleExploreDemo = () => {
    setDemoMode(true);
    router.replace('/(tabs)');
  };

  const beforeImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCiIFMZaHxcoTyMy-dqkdpwqAU2ba3OGUMefS_Hy3gfn3fwL9gKQCswCUu9VbTenT3KvJ6bEnmjTgEEcTHjzgctRcPYsumBEoNVM_t1sk9hk6KGTnKZsSk5ZX5wn4TGs7c9MFoQp1YJ11AoSzcFaV4PMbRW_CVgV8hB1UH_w1ahp8da9o6r7uYpjLQ8EG1pUZKXwBMhZrw0gTg7G-KEWtxzidKY6EcDZX67zGu5AgdueSoN4B5HaLg7Ug';
  const afterImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDV8TZ2VRU46_QXxECkZ3gLGgVeofmP0plSKHcgVHVMg0-ew_VXN_Tm8ovIAMTBcTJU7BIxmWXToLl-iyGA7bpixn5RFV74EHgPJM4yvCwNNYXUhtO5jwoxy_HC_B2TMCUVzKKM4lsIFlmrJ3E5NcMgsEO-MHLPx5SRWqaVXZNqAaI7-DFTr7AgntN7rny6rLYQz7tpi3Bu3uUUYa6_igAmzCqk-ykRXG-T6WukZtAF-rPjtLOj3T3yBw';

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 16), paddingBottom: Math.max(insets.bottom, 24) + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Glyph & Stage Indicator */}
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <View style={styles.brandGlyph}>
              <View style={[styles.ring, styles.ringLeft]} />
              <View style={[styles.ring, styles.ringRight]} />
            </View>
            <Text style={styles.brandTitle}>Proof</Text>
          </View>
          <View style={styles.stageIndicator}>
            <View style={styles.activeDot} />
            <View style={styles.inactiveDot} />
            <View style={styles.inactiveDot} />
            <Text style={styles.stageText}>01/03</Text>
          </View>
        </View>

        {/* Hero Header */}
        <View style={styles.heroHeader}>
          <View style={styles.tagBadge}>
            <MaterialIcons name="auto-awesome" size={14} color={colors.secondary} />
            <Text style={styles.tagText}>THE CRAFT OF ITERATION</Text>
          </View>
          <Text style={styles.heroHeadline}>See the progress you couldn&apos;t see.</Text>
          <Text style={styles.heroSubtitle}>
            Proof turns the small moments you record into a quiet, undeniable story of how far you&apos;ve come.
          </Text>
        </View>

        {/* Interactive Cinematic Split Ray Card */}
        <View style={styles.splitCard}>
          <BeforeAfterSlider
            beforeImage={beforeImage}
            afterImage={afterImage}
            beforeLabel="DAY 01 · RAW SKETCH"
            afterLabel="DAY 30 · MASTERWORK"
            aspectRatio={16 / 11}
          />
        </View>

        {/* 3 Delicate Value Proposition Badges */}
        <View style={styles.pillarsContainer}>
          {/* Pillar 1 */}
          <View style={[styles.pillarCard, shadows.level1]}>
            <View style={[styles.pillarIconCircle, { backgroundColor: colors.surfaceContainerHigh }]}>
              <MaterialIcons name="view-in-ar" size={20} color={colors.onSurface} />
            </View>
            <View style={styles.pillarTextCol}>
              <Text style={styles.pillarTitle}>Visual Evidence Over Checklists</Text>
              <Text style={styles.pillarDesc}>
                Tangible visual artifacts that prove dedication, bypassing hollow number streaks.
              </Text>
            </View>
          </View>

          {/* Pillar 2 */}
          <View style={[styles.pillarCard, shadows.level1]}>
            <View style={[styles.pillarIconCircle, { backgroundColor: colors.secondaryFixed }]}>
              <MaterialIcons name="history-toggle-off" size={20} color={colors.secondary} />
            </View>
            <View style={styles.pillarTextCol}>
              <Text style={styles.pillarTitle}>Interactive Time Travel</Text>
              <Text style={styles.pillarDesc}>
                Scrub across days, months, and milestones with seamless haptic-smooth playback.
              </Text>
            </View>
          </View>

          {/* Pillar 3 */}
          <View style={[styles.pillarCard, shadows.level1]}>
            <View style={[styles.pillarIconCircle, { backgroundColor: colors.tertiaryFixed }]}>
              <MaterialIcons name="museum" size={20} color={colors.tertiary} />
            </View>
            <View style={styles.pillarTextCol}>
              <Text style={styles.pillarTitle}>Personal Museum of Growth</Text>
              <Text style={styles.pillarDesc}>
                Curated exhibition spaces dedicated entirely to your private evolution.
              </Text>
            </View>
          </View>
        </View>

        {/* Call to Actions */}
        <View style={styles.ctaContainer}>
          <Button
            title="Start your first Journey"
            onPress={handleStartJourney}
            variant="aurora"
            icon={<MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />}
            iconPosition="right"
          />
          <Button
            title="Explore an interactive demo"
            onPress={handleExploreDemo}
            variant="secondary"
            icon={<MaterialIcons name="play-circle" size={20} color={colors.onSurfaceVariant} />}
            iconPosition="left"
            style={styles.ghostButton}
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
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandGlyph: {
    width: 30,
    height: 30,
    position: 'relative',
    marginRight: 8,
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
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
  brandTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },
  stageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.outlineVariant,
    opacity: 0.4,
  },
  stageText: {
    ...typography.monoMetric,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginLeft: 4,
  },
  heroHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  tagText: {
    ...typography.labelCaps,
    color: colors.secondary,
    letterSpacing: 1,
  },
  heroHeadline: {
    ...typography.displayHeroMobile,
    color: colors.onSurface,
    lineHeight: 38,
  },
  heroSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 320,
  },
  splitCard: {
    marginVertical: 12,
    borderRadius: 24,
    overflow: 'hidden',
  },
  pillarsContainer: {
    marginVertical: 16,
    gap: 10,
  },
  pillarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLowest,
  },
  pillarIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  pillarTextCol: {
    flex: 1,
  },
  pillarTitle: {
    ...typography.headlineSm,
    fontSize: 15,
    color: colors.onSurface,
  },
  pillarDesc: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 18,
  },
  ctaContainer: {
    marginTop: 12,
    gap: 10,
    paddingBottom: 24,
  },
  ghostButton: {
    backgroundColor: colors.surfaceContainerLow,
  },
});
