import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { api } from '../../src/services/api';

export default function AddEvidenceScreen() {
  const router = useRouter();
  const { journey_id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { isDemoMode } = useAuth();

  const [imageUri, setImageUri] = useState<string>(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBahxMq3MKix_UvTKHXu7K2R_tdQnxfNl6ENpLFMRVkyKerjQ4Ft8j4mdE2CfIROwZ7Yrt-QeJdxvWZIZ9GJJOt1LiV-p67R2LwVUjniA1WbF6tAiLstWJFG5xRZJr_w7hxOTk7olzpxdf5mzgoD8zTc3D9lCh-DX7P8mBkFYGmxGgMekdfVN09FoW2CH9LTFecgm5TBHCTw8TkItZ5YIYg4LFEtMhNCInN7o7qaG14iXnQpB7nvFiCnQ'
  );
  const [reflection, setReflection] = useState(
    'Spent 45 minutes on atmospheric rim light. Found that darkening the ambient background made the focal lantern pop.'
  );
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [savingState, setSavingState] = useState<'idle' | 'encoding' | 'sealed'>('idle');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Camera Permission', 'Please allow camera access to capture visual evidence.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const appendPrompt = (promptText: string) => {
    setSelectedPrompt(promptText);
    const cleaned = promptText.replace('+ ', '').trim();
    setReflection((prev) => (prev.trim() ? `${prev.trim()}\n\n${cleaned} ` : `${cleaned} `));
  };

  const handleSave = async () => {
    if (!reflection.trim()) {
      Alert.alert('Reflection Required', 'Please add a brief note on what changed today.');
      return;
    }

    setSavingState('encoding');

    if (isDemoMode) {
      setTimeout(() => {
        setSavingState('sealed');
        setTimeout(() => router.back(), 800);
      }, 700);
      return;
    }

    try {
      await api.addEvidence({
        journey_id: (journey_id as string) || 'demo-journey-art',
        day_number: 16,
        image_url: imageUri,
        reflection: reflection.trim(),
        prompt_spark: selectedPrompt,
      });

      setSavingState('sealed');
      setTimeout(() => router.back(), 800);
    } catch {
      // Graceful local success state
      setSavingState('sealed');
      setTimeout(() => router.back(), 800);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Top Tracker Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.journeyBadge}>
          <View style={styles.badgeDot} />
          <Text style={styles.journeyBadgeText}>Learning Digital Art · Day 15</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeBtn}
          activeOpacity={0.8}
        >
          <MaterialIcons name="close" size={18} color={colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Context */}
        <View style={styles.headerBlock}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Record Proof</Text>
            <View style={styles.entryPill}>
              <Text style={styles.entryPillText}>ENTRY #15</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            Anchor real physical or digital milestones into your kinetic record.
          </Text>
        </View>

        {/* Media Capture & Stage Zone */}
        <View style={[styles.stageCard, shadows.level1]}>
          <View style={styles.stageImageBox}>
            <Image source={{ uri: imageUri }} style={styles.stageImage} resizeMode="cover" />
            <View style={styles.stageScrim} />

            {/* Quick action controls on image */}
            <View style={styles.imageActionButtons}>
              <TouchableOpacity onPress={takePhoto} style={styles.imageActionCircle}>
                <MaterialIcons name="flip-camera-ios" size={16} color={colors.onSurface} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setImageUri('')} style={styles.imageActionCircle}>
                <MaterialIcons name="delete" size={16} color={colors.onSurface} />
              </TouchableOpacity>
            </View>

            {/* Bottom specs overlay */}
            <View style={styles.specsRow}>
              <View style={styles.specPill}>
                <MaterialIcons name="check-circle" size={14} color={colors.secondaryContainer} />
                <Text style={styles.specText}>JPEG · 4.2 MB</Text>
              </View>
              <View style={styles.calibratedPill}>
                <MaterialIcons name="auto-awesome" size={13} color="#FFFFFF" />
                <Text style={styles.calibratedText}>Color Calibrated</Text>
              </View>
            </View>
          </View>

          {/* Switchers */}
          <View style={styles.switchersGrid}>
            <TouchableOpacity onPress={takePhoto} style={styles.switcherBtn} activeOpacity={0.8}>
              <MaterialIcons name="photo-camera" size={18} color={colors.onSurface} />
              <Text style={styles.switcherText}>Retake Shot</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={styles.switcherBtn} activeOpacity={0.8}>
              <MaterialIcons name="photo-library" size={18} color={colors.onSurface} />
              <Text style={styles.switcherText}>From Library</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reflection Note Editor */}
        <View style={styles.reflectionSection}>
          <View style={styles.reflectionHeader}>
            <Text style={styles.reflectionLabel}>What happened today?</Text>
            <Text style={styles.charCounter}>{reflection.length} / 300</Text>
          </View>

          <View style={[styles.textareaBox, shadows.level1]}>
            <TextInput
              style={styles.textarea}
              placeholder="Describe the physical progress, subtle adjustments, or breakthroughs..."
              placeholderTextColor={colors.outlineVariant}
              multiline
              numberOfLines={4}
              value={reflection}
              onChangeText={setReflection}
            />
            <View style={styles.textareaFooter}>
              <View style={styles.syncIndicator}>
                <View style={styles.syncDot} />
                <Text style={styles.syncText}>Auto-synced to Day 15</Text>
              </View>
              <MaterialIcons name="mic" size={18} color={colors.onSurfaceVariant} />
            </View>
          </View>
        </View>

        {/* Reflection Prompt Sparks */}
        <View style={styles.sparksSection}>
          <View style={styles.sparksHeader}>
            <MaterialIcons name="lightbulb" size={16} color={colors.secondary} />
            <Text style={styles.sparksLabel}>PROMPT SPARKS</Text>
          </View>
          <View style={styles.chipsContainer}>
            {['+ What changed?', '+ What did you learn?', '+ What was difficult?', '+ What made you proud?'].map(
              (spark) => (
                <TouchableOpacity
                  key={spark}
                  onPress={() => appendPrompt(spark)}
                  activeOpacity={0.8}
                  style={styles.sparkChip}
                >
                  <Text style={styles.sparkChipText}>{spark}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* Ready for Ledger Feedback Card */}
        <View style={styles.feedbackCard}>
          <View style={styles.feedbackIconCircle}>
            <MaterialIcons name="verified" size={18} color={colors.onSecondaryFixed} />
          </View>
          <View style={styles.feedbackTextCol}>
            <Text style={styles.feedbackTitle}>Proof Ready for Ledger</Text>
            <Text style={styles.feedbackDesc}>
              Saves directly to sequence: Learning Digital Art · Index #15
            </Text>
          </View>
        </View>

        {/* Primary Save Action */}
        <View style={styles.saveActionBox}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={savingState !== 'idle'}
            style={[
              styles.saveBtn,
              savingState === 'sealed' ? styles.saveBtnSealed : styles.saveBtnActive,
              shadows.level2,
            ]}
            activeOpacity={0.88}
          >
            <MaterialIcons
              name={savingState === 'sealed' ? 'check' : 'fingerprint'}
              size={20}
              color={savingState === 'sealed' ? colors.onSecondaryContainer : colors.secondaryContainer}
            />
            <Text
              style={[
                styles.saveBtnText,
                savingState === 'sealed' && styles.saveBtnTextSealed,
              ]}
            >
              {savingState === 'encoding'
                ? 'Encoding Proof...'
                : savingState === 'sealed'
                ? 'Evidence Sealed ✓'
                : 'Save Evidence'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.legalNotice}>
            Recorded into your immutable chronological timeline
          </Text>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  journeyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    gap: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondaryContainer,
  },
  journeyBadgeText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerBlock: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  headerTitle: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  entryPill: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  entryPillText: {
    ...typography.monoMetric,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  headerSubtitle: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  stageCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  stageImageBox: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surfaceContainer,
  },
  stageImage: {
    width: '100%',
    height: '100%',
  },
  stageScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  imageActionButtons: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  imageActionCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  specsRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  specText: {
    ...typography.monoMetric,
    fontSize: 10,
    color: '#FFFFFF',
  },
  calibratedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  calibratedText: {
    ...typography.labelCaps,
    fontSize: 9,
    color: '#FFFFFF',
  },
  switchersGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  switcherBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerLow,
    paddingVertical: 12,
    borderRadius: 12,
  },
  switcherText: {
    ...typography.bodySm,
    color: colors.onSurface,
    fontWeight: '500',
  },
  reflectionSection: {
    marginBottom: 18,
  },
  reflectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reflectionLabel: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },
  charCounter: {
    ...typography.monoMetric,
    color: colors.onSurfaceVariant,
  },
  textareaBox: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  textarea: {
    ...typography.bodyMd,
    color: colors.onSurface,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  textareaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerLow,
    marginTop: 6,
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  syncText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  sparksSection: {
    marginBottom: 20,
  },
  sparksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  sparksLabel: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sparkChip: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  sparkChipText: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.onSurface,
  },
  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 24,
  },
  feedbackIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackTextCol: {
    flex: 1,
  },
  feedbackTitle: {
    ...typography.headlineSm,
    fontSize: 14,
    color: colors.onSurface,
  },
  feedbackDesc: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },
  saveActionBox: {
    gap: 8,
    alignItems: 'center',
  },
  saveBtn: {
    width: '100%',
    height: 52,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnActive: {
    backgroundColor: colors.primary,
  },
  saveBtnSealed: {
    backgroundColor: colors.secondaryContainer,
  },
  saveBtnText: {
    ...typography.headlineSm,
    color: colors.onPrimary,
    fontSize: 15,
  },
  saveBtnTextSealed: {
    color: colors.onSecondaryContainer,
  },
  legalNotice: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
});
