import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../../src/theme';
import { Button } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError(null);
    setLoading(true);

    const res = await resetPassword(email.trim());
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setSent(true);
    }
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
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
          activeOpacity={0.8}
        >
          <MaterialIcons name="close" size={20} color={colors.onSurface} />
        </TouchableOpacity>

        {/* Brand */}
        <View style={styles.brandCenter}>
          <View style={styles.brandGlyph}>
            <View style={[styles.ring, styles.ringLeft]} />
            <View style={[styles.ring, styles.ringRight]} />
          </View>
          <Text style={styles.appTitle}>Proof</Text>
          <Text style={styles.tagline}>See the progress you couldn&apos;t see.</Text>
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, shadows.level1]}>
          <Text style={styles.cardHeader}>Reset your password</Text>
          <Text style={styles.cardSubtitle}>
            Enter your email and we&apos;ll send you a link to create a new password.
          </Text>

          {!sent && (
            <>
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

              <Button
                title="Send Reset Link"
                onPress={handleSubmit}
                variant="primary"
                loading={loading}
                style={styles.submitBtn}
              />
            </>
          )}

          {sent && (
            <View style={styles.successState}>
              <View style={styles.successIconCircle}>
                <MaterialIcons name="check" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.successText}>
                We sent a password reset link to <Text style={styles.emailText}>{email}</Text>.
              </Text>
              <Text style={styles.successSubtitle}>
                If you don&apos;t see it, check your spam folder.
              </Text>
              <Button
                title="Back to Sign In"
                onPress={() => router.replace('/(auth)/login')}
                variant="primary"
                style={styles.submitBtn}
              />
            </View>
          )}

          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>Back to Sign In</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
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
    width: '100%',
    maxWidth: 360,
  },
  cardHeader: {
    ...typography.headlineSm,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  cardSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
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
    width: '100%',
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
  successState: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  successText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 22,
  },
  emailText: {
    fontWeight: '600',
    color: colors.onSurface,
  },
  successSubtitle: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backLinkText: {
    ...typography.bodySm,
    color: colors.secondary,
    fontWeight: '500',
  },
});