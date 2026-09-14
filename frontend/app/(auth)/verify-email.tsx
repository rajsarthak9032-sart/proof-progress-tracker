import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../../src/theme';
import { Button } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resendVerification, signOut, verifyEmail } = useAuth();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();

  const [email, setEmail] = useState<string>(emailParam ?? '');
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleResend = async () => {
    if (!email.trim()) {
      setResendError('Please enter your email address.');
      return;
    }
    setResending(true);
    setResendError(null);
    setResendSuccess(false);

    const res = await resendVerification(email.trim());
    setResending(false);
    if (res.error) {
      setResendError(res.error);
    } else {
      setResendSuccess(true);
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    const res = await verifyEmail();
    setChecking(false);
    if (res.error) {
      // Email not verified yet, stay on screen
    } else {
      // Verified, navigate to home
      router.replace('/(tabs)');
    }
  };

  const handleBackToSignIn = () => {
    signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Back button */}
      <TouchableOpacity
        onPress={handleBackToSignIn}
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

      {/* Verification Card */}
      <View style={[styles.formCard, shadows.level1]}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="mark-email-read" size={28} color={colors.secondary} />
          </View>
        </View>

        <Text style={styles.cardHeader}>Check your email</Text>
        <Text style={styles.cardSubtitle}>
          We sent a verification email to <Text style={styles.emailText}>{email || 'your inbox'}</Text>.
        </Text>

        <Text style={styles.instructionText}>
          Open the email and click the verification link to activate your account.
        </Text>

        {resendSuccess && (
          <View style={styles.successBanner}>
            <MaterialIcons name="check-circle" size={16} color={colors.secondary} />
            <Text style={styles.successText}>Verification email resent!</Text>
          </View>
        )}

        {resendError && (
          <View style={styles.errorBanner}>
            <MaterialIcons name="info" size={16} color={colors.error} />
            <Text style={styles.errorBannerText}>{resendError}</Text>
          </View>
        )}

        <View style={styles.buttonGroup}>
          <Button
            title="I&apos;ve Verified — Continue"
            onPress={handleCheckVerification}
            variant="primary"
            loading={checking}
            style={styles.submitBtn}
          />
          <Button
            title="Resend Email"
            onPress={handleResend}
            variant="secondary"
            loading={resending}
            disabled={resending}
            style={styles.resendBtn}
          />
        </View>

        <TouchableOpacity
          onPress={handleBackToSignIn}
          style={styles.backLink}
        >
          <Text style={styles.backLinkText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 16,
    lineHeight: 22,
  },
  emailText: {
    fontWeight: '600',
    color: colors.onSurface,
  },
  instructionText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryFixed,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  successText: {
    ...typography.bodySm,
    color: colors.onSecondaryFixed,
    flex: 1,
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
  buttonGroup: {
    gap: 10,
    marginBottom: 16,
  },
  submitBtn: {
    marginBottom: 0,
  },
  resendBtn: {
    marginBottom: 0,
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