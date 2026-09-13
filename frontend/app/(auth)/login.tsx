import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../../src/theme';
import { Button } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signInWithEmail, signUpWithEmail, setDemoMode } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError(null);
    setLoading(true);

    if (isSignUp) {
      const res = await signUpWithEmail(email.trim(), password);
      setLoading(false);
      if (res.error) {
        setError(res.error);
      } else {
        router.replace('/(tabs)');
      }
    } else {
      const res = await signInWithEmail(email.trim(), password);
      setLoading(false);
      if (res.error) {
        setError(res.error);
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  const handleDemoMode = () => {
    setDemoMode(true);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Back / Close button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
          activeOpacity={0.8}
        >
          <MaterialIcons name="close" size={20} color={colors.onSurface} />
        </TouchableOpacity>

        {/* Brand glyph */}
        <View style={styles.brandCenter}>
          <View style={styles.brandGlyph}>
            <View style={[styles.ring, styles.ringLeft]} />
            <View style={[styles.ring, styles.ringRight]} />
          </View>
          <Text style={styles.appTitle}>Proof</Text>
          <Text style={styles.tagline}>See the progress you couldn&apos;t see.</Text>
        </View>

        {/* Form Box */}
        <View style={[styles.formCard, shadows.level1]}>
          <Text style={styles.cardHeader}>
            {isSignUp ? 'Create your Proof account' : 'Sign in to your records'}
          </Text>

          {error && (
            <View style={styles.errorBanner}>
              <MaterialIcons name="info" size={16} color={colors.error} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.inputField}
              placeholder="curator@craft.studio"
              placeholderTextColor={colors.outlineVariant}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <TextInput
              style={styles.inputField}
              placeholder="••••••••••••"
              placeholderTextColor={colors.outlineVariant}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Button
            title={isSignUp ? 'Create Account' : 'Sign In'}
            onPress={handleSubmit}
            variant="primary"
            loading={loading}
            style={styles.submitBtn}
          />

          <TouchableOpacity
            onPress={() => {
              setError(null);
              setIsSignUp(!isSignUp);
            }}
            style={styles.switchModeRow}
          >
            <Text style={styles.switchModeText}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={styles.switchModeHighlight}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo Mode Reassurance Button */}
        <View style={styles.demoSection}>
          <Text style={styles.demoPrompt}>Evaluating Proof for Shipaton 2026?</Text>
          <Button
            title="Explore Interactive Demo Mode"
            onPress={handleDemoMode}
            variant="ghost"
            icon={<MaterialIcons name="verified" size={18} color={colors.secondary} />}
            iconPosition="left"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  brandCenter: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandGlyph: {
    width: 36,
    height: 36,
    position: 'relative',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
  },
  ringLeft: {
    left: 2,
    borderColor: colors.primary,
  },
  ringRight: {
    right: 2,
    borderColor: colors.secondaryContainer,
  },
  appTitle: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  tagline: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  cardHeader: {
    ...typography.headlineSm,
    color: colors.onSurface,
    marginBottom: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorContainer,
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    ...typography.bodySm,
    color: colors.onError,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    marginBottom: 6,
  },
  inputField: {
    height: 50,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 14,
    paddingHorizontal: 16,
    ...typography.bodyMd,
    color: colors.onSurface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 16,
  },
  switchModeRow: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  switchModeText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  switchModeHighlight: {
    color: colors.secondary,
    fontWeight: '600',
  },
  demoSection: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  demoPrompt: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
});
