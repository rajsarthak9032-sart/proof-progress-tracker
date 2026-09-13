import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Share,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../../src/theme';
import { ProofHeader, Button } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { DEMO_PROOF_STORY } from '../../src/services/demoData';

export default function ProofStoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  useAuth();

  const [copiedToast, setCopiedToast] = useState(false);
  const story = DEMO_PROOF_STORY;

  const handleShareStory = async () => {
    try {
      const shareMessage = `Look how far I've come in 30 days of ${story.title}! Check out my proof timeline on Proof. #ProofApp #Shipaton2026`;
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: story.title,
            text: shareMessage,
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(shareMessage);
          setCopiedToast(true);
          setTimeout(() => setCopiedToast(false), 2400);
        }
      } else {
        await Share.share({
          message: shareMessage,
          title: story.title,
        });
      }
    } catch {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2400);
    }
  };

  return (
    <View style={styles.screen}>
      <ProofHeader
        title="Proof"
        subtitle="Stories"
        dayLabel="DAY 30"
        onProfilePress={() => router.push('/(tabs)/profile')}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 96 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Story Header */}
        <View style={styles.headerBlock}>
          <View style={styles.retroBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.retroBadgeText}>AUTOMATIC RETROSPECTIVE</Text>
          </View>
          <Text style={styles.heroTitle}>Your Proof Story</Text>
          <Text style={styles.heroSubtitle}>
            Learning Digital Art · <Text style={styles.heroHighlight}>30 Days of Evolution</Text>
          </Text>
        </View>

        {/* Narrative Flow Chapters with Vertical Spine Track */}
        <View style={styles.timelineSpineWrapper}>
          <View style={styles.spineLine} />

          {story.chapters.map((chapter, idx) => (
            <View key={chapter.day_number} style={styles.chapterRow}>
              {/* Spine Node Disc */}
              <View style={[styles.spineNode, shadows.level1]}>
                <Text style={styles.spineNodeText}>
                  {String(chapter.day_number).padStart(2, '0')}
                </Text>
              </View>

              {/* Chapter Card */}
              <View style={[styles.chapterCard, shadows.level1]}>
                <View style={styles.chapterHeader}>
                  <Text style={styles.chapterDayLabel}>DAY {chapter.day_number}</Text>
                  <Text style={styles.chapterStageLabel}>
                    {idx === 0 ? 'Genesis' : idx === 3 ? 'Final Work' : `+${chapter.day_number} Days`}
                  </Text>
                </View>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>

                <View style={styles.chapterImageBox}>
                  <Image source={{ uri: chapter.image_url }} style={styles.chapterImage} resizeMode="cover" />
                  <View style={styles.chapterBadge}>
                    <Text style={styles.chapterBadgeText}>{chapter.badge_label}</Text>
                  </View>
                </View>

                <Text style={styles.chapterNarrative}>{chapter.narrative}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* The Climax Section: Interactive Proof Compare */}
        <View style={[styles.climaxCard, shadows.level1]}>
          <View style={styles.climaxHeader}>
            <Text style={styles.climaxLabel}>CULMINATION</Text>
            <Text style={styles.climaxTitle}>Look how far you&apos;ve come.</Text>
            <Text style={styles.climaxQuote}>{story.culmination_quote}</Text>
          </View>

          {/* Mini Side-by-Side Comparison */}
          <View style={styles.sideBySideRow}>
            <View style={styles.sideCol}>
              <View style={styles.sideImageContainer}>
                <Image
                  source={{ uri: story.chapters[0].image_url }}
                  style={styles.sideImage}
                  resizeMode="cover"
                />
                <View style={styles.sideTag}>
                  <Text style={styles.sideTagText}>DAY 1</Text>
                </View>
              </View>
              <Text style={styles.sideSubtext}>Initial Gesture</Text>
            </View>

            <View style={styles.sideCol}>
              <View style={styles.sideImageContainer}>
                <Image
                  source={{ uri: story.chapters[3].image_url }}
                  style={styles.sideImage}
                  resizeMode="cover"
                />
                <View style={[styles.sideTag, styles.sideTagPro]}>
                  <Text style={[styles.sideTagText, styles.sideTagTextPro]}>DAY 30</Text>
                </View>
              </View>
              <Text style={[styles.sideSubtext, styles.sideSubtextPro]}>Synthesized Craft</Text>
            </View>
          </View>

          {/* Growth Stat Pill Strip */}
          <View style={styles.statsStrip}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>HOURS</Text>
              <Text style={styles.statValue}>{story.hours_invested}h</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>CAPTURES</Text>
              <Text style={styles.statValue}>30/30</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>MASTERY</Text>
              <Text style={[styles.statValue, styles.statValueMastery]}>{story.mastery_delta}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title={copiedToast ? 'Story Link Copied! ✓' : 'Share My Proof Story'}
            onPress={handleShareStory}
            variant="aurora"
            icon={<MaterialIcons name="share" size={20} color="#FFFFFF" />}
            iconPosition="left"
          />
          <Button
            title="Save as 4K Retrospective Video"
            onPress={() => alert('Retrospective growth video rendered in high quality.')}
            variant="primary"
            icon={<MaterialIcons name="movie-creation" size={20} color="#FFFFFF" />}
            iconPosition="left"
          />
          <Button
            title="Keep Exploring"
            onPress={() => router.replace('/(tabs)')}
            variant="secondary"
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
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 24,
  },
  retroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 6,
    marginBottom: 8,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  retroBadgeText: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    fontSize: 10,
  },
  heroTitle: {
    ...typography.displayHeroMobile,
    color: colors.onSurface,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 4,
    textAlign: 'center',
  },
  heroHighlight: {
    color: colors.onSurface,
    fontWeight: '600',
  },
  timelineSpineWrapper: {
    position: 'relative',
    gap: 24,
    marginBottom: 28,
  },
  spineLine: {
    position: 'absolute',
    left: 27,
    top: 24,
    bottom: 24,
    width: 2,
    backgroundColor: colors.secondaryContainer,
    opacity: 0.35,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  spineNode: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.06)',
  },
  spineNodeText: {
    ...typography.monoMetric,
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  chapterCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chapterDayLabel: {
    ...typography.labelCaps,
    color: colors.secondary,
    fontWeight: '700',
  },
  chapterStageLabel: {
    ...typography.monoMetric,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  chapterTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
    marginBottom: 10,
  },
  chapterImageBox: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHigh,
    position: 'relative',
    marginBottom: 10,
  },
  chapterImage: {
    width: '100%',
    height: '100%',
  },
  chapterBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  chapterBadgeText: {
    ...typography.monoMetric,
    fontSize: 9,
    color: colors.onSurface,
    fontWeight: '700',
  },
  chapterNarrative: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 19,
  },
  climaxCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
    gap: 16,
    marginBottom: 24,
  },
  climaxHeader: {
    alignItems: 'center',
    textAlign: 'center',
  },
  climaxLabel: {
    ...typography.labelCaps,
    color: colors.secondary,
    marginBottom: 4,
  },
  climaxTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    textAlign: 'center',
  },
  climaxQuote: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
  },
  sideBySideRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surfaceContainerLow,
    padding: 10,
    borderRadius: 16,
  },
  sideCol: {
    flex: 1,
    alignItems: 'center',
  },
  sideImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surfaceContainer,
  },
  sideImage: {
    width: '100%',
    height: '100%',
  },
  sideTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sideTagPro: {
    backgroundColor: colors.secondaryContainer,
  },
  sideTagText: {
    ...typography.monoMetric,
    fontSize: 9,
    fontWeight: '700',
    color: colors.onSurface,
  },
  sideTagTextPro: {
    color: '#FFFFFF',
  },
  sideSubtext: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    fontSize: 10,
    marginTop: 6,
  },
  sideSubtextPro: {
    color: colors.secondary,
    fontWeight: '700',
  },
  statsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.outlineVariant,
    opacity: 0.3,
  },
  statLabel: {
    ...typography.monoMetric,
    fontSize: 9,
    color: colors.onSurfaceVariant,
  },
  statValue: {
    ...typography.headlineSm,
    color: colors.onSurface,
    marginTop: 2,
  },
  statValueMastery: {
    color: colors.secondary,
    fontWeight: '700',
  },
  actionsContainer: {
    gap: 12,
    paddingBottom: 24,
  },
});
