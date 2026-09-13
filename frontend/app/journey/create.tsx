import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../../src/theme';
import { ProofHeader, Button } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { api } from '../../src/services/api';
import { CategoryType } from '../../src/types';

interface CategoryOption {
  key: CategoryType;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  exampleTitle: string;
}

const CATEGORIES: CategoryOption[] = [
  { key: 'Art', label: 'Art', icon: 'palette', exampleTitle: 'Learning Digital Art' },
  { key: 'Coding', label: 'Coding', icon: 'terminal', exampleTitle: 'Building React Native Engine' },
  { key: 'Music', label: 'Music', icon: 'graphic-eq', exampleTitle: 'Mastering Polyphonic Synth' },
  { key: 'Writing', label: 'Writing', icon: 'border-color', exampleTitle: 'First Draft Sci-Fi Novella' },
  { key: 'Fitness', label: 'Fitness', icon: 'fitness-center', exampleTitle: 'Handstand Balance & Core' },
  { key: 'Language', label: 'Language', icon: 'translate', exampleTitle: 'Conversational Japanese' },
  { key: 'Other', label: 'Other', icon: 'grain', exampleTitle: 'Architectural Woodworking' },
];

interface DurationOption {
  days: number;
  label: string;
  sublabel: string;
  recommended?: boolean;
}

const DURATIONS: DurationOption[] = [
  { days: 7, label: '7 Days', sublabel: 'Sprint • Quick iteration' },
  { days: 30, label: '30 Days', sublabel: 'The Classic Evolution', recommended: true },
  { days: 90, label: '90 Days', sublabel: 'Deep Mastery • Structural transformation' },
  { days: 365, label: 'Custom Horizon', sublabel: 'Open cadence for organic discovery' },
];

export default function CreateJourneyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDemoMode } = useAuth();

  const [title, setTitle] = useState('Learning Digital Art');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Art');
  const [selectedDays, setSelectedDays] = useState<number>(30);
  const [loading, setLoading] = useState(false);

  const handleCategorySelect = (cat: CategoryOption) => {
    setSelectedCategory(cat.key);
    setTitle(cat.exampleTitle);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a name for your journey.');
      return;
    }

    setLoading(true);

    if (isDemoMode) {
      // If in demo mode, navigate back with feedback
      setTimeout(() => {
        setLoading(false);
        router.back();
      }, 400);
      return;
    }

    try {
      await api.createJourney({
        title: title.trim(),
        category: selectedCategory,
        duration_days: selectedDays,
      });
      setLoading(false);
      router.replace('/(tabs)');
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err.message || 'Unable to create journey. Please retry.');
    }
  };

  return (
    <View style={styles.screen}>
      <ProofHeader
        title="Create Journey"
        subtitle="Step 1 of 2"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 88 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Indicator */}
        <View style={styles.stepMetaRow}>
          <View style={styles.stepLeft}>
            <Text style={styles.stepCount}>STEP 1 OF 2</Text>
            <View style={styles.stepDot} />
            <Text style={styles.stepName}>Intention</Text>
          </View>
          <Text style={styles.stepPercent}>50% Completed</Text>
        </View>

        {/* Segmented Progress Bar */}
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={[...colors.auroraGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressFill}
          />
          <View style={styles.progressEmpty} />
        </View>

        {/* Hero Prompt Typography */}
        <View style={styles.heroPrompt}>
          <Text style={styles.heroTitle}>What are you{'\n'}working on?</Text>
          <Text style={styles.heroSubtitle}>What do you want to see yourself improve at?</Text>
        </View>

        {/* Journey Title Input */}
        <View style={[styles.inputCard, shadows.level1]}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>JOURNEY TITLE</Text>
            <MaterialIcons name="edit" size={16} color={colors.secondary} />
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Handcrafted Ceramic Teapots"
            placeholderTextColor={colors.outlineVariant}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Discipline Category Pills */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DISCIPLINE CATEGORY</Text>
          <View style={styles.pillContainer}>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => handleCategorySelect(cat)}
                  activeOpacity={0.8}
                  style={[
                    styles.categoryPill,
                    isActive ? styles.activeCategoryPill : styles.inactiveCategoryPill,
                    shadows.level1,
                  ]}
                >
                  <MaterialIcons
                    name={cat.icon}
                    size={15}
                    color={isActive ? colors.onPrimary : colors.onSurfaceVariant}
                  />
                  <Text
                    style={[
                      styles.categoryPillText,
                      isActive && styles.activeCategoryPillText,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Duration Horizon Selector */}
        <View style={styles.section}>
          <View style={styles.durationHeader}>
            <Text style={styles.durationTitle}>When do you want to look back?</Text>
            <Text style={styles.durationBadge}>Milestone HUD</Text>
          </View>

          <View style={styles.durationsList}>
            {DURATIONS.map((dur) => {
              const isSelected = selectedDays === dur.days;
              if (isSelected && dur.recommended) {
                return (
                  <TouchableOpacity
                    key={dur.days}
                    activeOpacity={0.9}
                    onPress={() => setSelectedDays(dur.days)}
                    style={[styles.recommendedBorder, shadows.auroraGlow]}
                  >
                    <LinearGradient
                      colors={[...colors.auroraGradient]}
                      style={styles.gradientBorderInner}
                    >
                      <View style={styles.recommendedCardInner}>
                        <View style={styles.durationLeft}>
                          <View style={styles.recommendedIconBox}>
                            <Text style={styles.recommendedDayNumber}>{dur.days}</Text>
                          </View>
                          <View>
                            <View style={styles.recTitleRow}>
                              <Text style={styles.durationOptionTitle}>{dur.label}</Text>
                              <View style={styles.recTag}>
                                <Text style={styles.recTagText}>RECOMMENDED</Text>
                              </View>
                            </View>
                            <Text style={styles.recommendedSub}>{dur.sublabel}</Text>
                          </View>
                        </View>
                        <View style={styles.checkCircle}>
                          <MaterialIcons name="check" size={14} color="#FFFFFF" />
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={dur.days}
                  activeOpacity={0.88}
                  onPress={() => setSelectedDays(dur.days)}
                  style={[
                    styles.durationCard,
                    isSelected && styles.durationCardSelected,
                    shadows.level1,
                  ]}
                >
                  <View style={styles.durationLeft}>
                    <View style={styles.durationIconBox}>
                      {dur.days > 90 ? (
                        <MaterialIcons name="all-inclusive" size={20} color={colors.onSurface} />
                      ) : (
                        <Text style={styles.durationDayNumber}>{dur.days}</Text>
                      )}
                    </View>
                    <View>
                      <Text style={styles.durationOptionTitle}>{dur.label}</Text>
                      <Text style={styles.durationSublabel}>{dur.sublabel}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInnerDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Reassurance Card */}
        <View style={styles.reassuranceCard}>
          <View style={styles.reassuranceIconCircle}>
            <MaterialIcons name="verified" size={18} color={colors.secondary} />
          </View>
          <Text style={styles.reassuranceText}>
            <Text style={styles.reassuranceBold}>Proof respects your craft.</Text> No daily streaks or guilt checklists. Only record moments of actual work when something clicks.
          </Text>
        </View>

        {/* Create Journey Button */}
        <View style={styles.ctaWrapper}>
          <Button
            title="Create Journey"
            onPress={handleCreate}
            variant="aurora"
            loading={loading}
            icon={<MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />}
            iconPosition="right"
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
  stepMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepCount: {
    ...typography.monoMetric,
    color: colors.secondary,
    fontWeight: '700',
  },
  stepDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.secondary,
  },
  stepName: {
    ...typography.monoMetric,
    color: colors.onSurfaceVariant,
  },
  stepPercent: {
    ...typography.monoMetric,
    color: colors.onSurfaceVariant,
    opacity: 0.8,
  },
  progressTrack: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 24,
    gap: 4,
  },
  progressFill: {
    flex: 1,
    height: '100%',
    borderRadius: 2,
  },
  progressEmpty: {
    flex: 1,
    height: '100%',
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 2,
  },
  heroPrompt: {
    marginBottom: 24,
  },
  heroTitle: {
    ...typography.displayHeroMobile,
    color: colors.onSurface,
    lineHeight: 38,
  },
  heroSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 6,
  },
  inputCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  inputLabel: {
    ...typography.labelCaps,
    color: colors.secondary,
    fontWeight: '700',
  },
  textInput: {
    ...typography.headlineSm,
    color: colors.onSurface,
    paddingVertical: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    marginBottom: 10,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    gap: 6,
  },
  activeCategoryPill: {
    backgroundColor: colors.primary,
  },
  inactiveCategoryPill: {
    backgroundColor: colors.surfaceContainerLowest,
  },
  categoryPillText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  activeCategoryPillText: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  durationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  durationTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },
  durationBadge: {
    ...typography.monoMetric,
    color: colors.secondary,
  },
  durationsList: {
    gap: 10,
  },
  durationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  durationCardSelected: {
    borderColor: colors.secondary,
  },
  durationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  durationIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationDayNumber: {
    ...typography.headlineSm,
    color: colors.onSurface,
    fontWeight: '700',
  },
  durationOptionTitle: {
    ...typography.headlineSm,
    fontSize: 15,
    color: colors.onSurface,
  },
  durationSublabel: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    backgroundColor: colors.secondary,
  },
  radioInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  recommendedBorder: {
    borderRadius: 20,
    padding: 2,
  },
  gradientBorderInner: {
    borderRadius: 18,
    padding: 2,
  },
  recommendedCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 14,
  },
  recommendedIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(253, 106, 73, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendedDayNumber: {
    ...typography.headlineSm,
    color: colors.secondary,
    fontWeight: '700',
  },
  recTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recTag: {
    backgroundColor: colors.secondaryFixed,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  recTagText: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.onSecondaryFixed,
    fontWeight: '700',
  },
  recommendedSub: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '500',
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reassuranceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  reassuranceIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reassuranceText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    flex: 1,
    lineHeight: 19,
  },
  reassuranceBold: {
    color: colors.onSurface,
    fontWeight: '600',
  },
  ctaWrapper: {
    marginBottom: 24,
  },
});
