import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../src/theme';
import { Button } from '../src/components';
import { usePurchases } from '../src/context/PurchasesContext';

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isPro, offering, purchasePackage, restorePurchases, isConfigured } = usePurchases();

  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);

    if (!isConfigured || !offering) {
      // If store is not configured or in dev environment
      setLoading(false);
      Alert.alert(
        'RevenueCat Store Notice',
        'NOT VERIFIED — REQUIRES NATIVE STORE / REVENUECAT TEST ENVIRONMENT\n\nIn production, this initiates the native in-app purchase flow via RevenueCat for proof_pro.'
      );
      return;
    }

    const annualPackage = offering.availablePackages.find(
      (pkg: any) => pkg.product?.identifier === 'proof_annual'
    );
    const monthlyPackage = offering.availablePackages.find(
      (pkg: any) => pkg.product?.identifier === 'proof_monthly'
    );

    const packageToBuy =
      selectedPlan === 'annual'
        ? annualPackage || offering.availablePackages[0]
        : monthlyPackage || offering.availablePackages[1];

    if (!packageToBuy) {
      setLoading(false);
      Alert.alert('Store Notice', 'Selected product package is not active in the current RevenueCat offering.');
      return;
    }

    const res = await purchasePackage(packageToBuy);
    setLoading(false);

    if (res.success) {
      Alert.alert('Welcome to Proof Pro', 'Your entitlement proof_pro is now active!');
      router.back();
    } else if (res.error) {
      Alert.alert('Purchase', res.error);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    const res = await restorePurchases();
    setLoading(false);

    if (res.success) {
      Alert.alert('Purchases Restored', 'Your Proof Pro entitlement was restored.');
      router.back();
    } else {
      Alert.alert('Restore Purchases', res.error || 'No active Proof Pro subscription found.');
    }
  };

  const features = [
    { title: 'Unlimited Journeys', desc: 'Document multiple crafts and pursuits simultaneously.' },
    { title: 'Full Time Travel Experience', desc: 'Continuous haptic scrubbing across complete chronological records.' },
    { title: 'Advanced Before/After Split Viewer', desc: 'Precision pixel comparison between baseline and mastery.' },
    { title: 'Proof AI Lens Analysis', desc: 'Grounded progress pattern recognition powered by Qwen.' },
    { title: 'Unlimited Proof Stories', desc: 'Curate and share high-resolution retrospective stories.' },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeBtn}
          activeOpacity={0.8}
        >
          <MaterialIcons name="close" size={20} color={colors.onSurface} />
        </TouchableOpacity>

        {/* Hero Header */}
        <View style={styles.heroHeader}>
          <LinearGradient
            colors={[...colors.auroraGradient]}
            style={styles.heroGlowCircle}
          >
            <MaterialIcons name="auto-awesome" size={28} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.heroTitle}>Proof Pro</Text>
          <Text style={styles.heroSubtitle}>
            Unlock the complete personal museum experience for all your creative pursuits.
          </Text>
        </View>

        {/* Features List */}
        <View style={[styles.featuresCard, shadows.level1]}>
          {features.map((feat, idx) => (
            <View key={feat.title} style={styles.featureRow}>
              <View style={styles.featureCheck}>
                <MaterialIcons name="check" size={16} color={colors.secondary} />
              </View>
              <View style={styles.featureTextCol}>
                <Text style={styles.featureTitle}>{feat.title}</Text>
                <Text style={styles.featureDesc}>{feat.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plan Selector */}
        <View style={styles.plansContainer}>
          {/* Annual Option */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('annual')}
            activeOpacity={0.9}
            style={[
              styles.planCard,
              selectedPlan === 'annual' && styles.planCardSelected,
              shadows.level1,
            ]}
          >
            <View style={styles.planTopRow}>
              <View style={styles.planRadioRow}>
                <View style={[styles.radioCircle, selectedPlan === 'annual' && styles.radioCircleSelected]}>
                  {selectedPlan === 'annual' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.planName}>Annual Membership</Text>
              </View>
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>SAVE 35%</Text>
              </View>
            </View>
            <View style={styles.planPriceRow}>
              <Text style={styles.planPrice}>$4.99</Text>
              <Text style={styles.planPeriod}> / month, billed annually ($59.99/yr)</Text>
            </View>
          </TouchableOpacity>

          {/* Monthly Option */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.9}
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardSelected,
              shadows.level1,
            ]}
          >
            <View style={styles.planTopRow}>
              <View style={styles.planRadioRow}>
                <View style={[styles.radioCircle, selectedPlan === 'monthly' && styles.radioCircleSelected]}>
                  {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.planName}>Monthly Membership</Text>
              </View>
            </View>
            <View style={styles.planPriceRow}>
              <Text style={styles.planPrice}>$7.99</Text>
              <Text style={styles.planPeriod}> / month</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* CTA & Terms */}
        <View style={styles.ctaSection}>
          <Button
            title={isPro ? 'You are subscribed to Pro' : 'Unlock Proof Pro'}
            onPress={handlePurchase}
            variant="aurora"
            loading={loading}
            disabled={isPro}
          />

          <TouchableOpacity onPress={handleRestore} style={styles.restoreLink} activeOpacity={0.8}>
            <Text style={styles.restoreLinkText}>Restore Purchases</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            Recurring billing. Cancel anytime in App Store / Google Play settings.
            Monetization powered by official RevenueCat integration.
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
  scrollContent: {
    paddingHorizontal: 20,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  heroHeader: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 24,
  },
  heroGlowCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...shadows.auroraGlow,
  },
  heroTitle: {
    ...typography.displayHeroMobile,
    color: colors.onSurface,
  },
  heroSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 300,
  },
  featuresCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 24,
    padding: 20,
    gap: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    ...typography.headlineSm,
    fontSize: 14,
    color: colors.onSurface,
  },
  featureDesc: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 1,
    lineHeight: 16,
  },
  plansContainer: {
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardSelected: {
    borderColor: colors.secondary,
  },
  planTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.secondary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.secondary,
  },
  planName: {
    ...typography.headlineSm,
    fontSize: 15,
    color: colors.onSurface,
  },
  saveBadge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  saveBadgeText: {
    ...typography.labelCaps,
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
    paddingLeft: 30,
  },
  planPrice: {
    ...typography.headlineMd,
    color: colors.onSurface,
    fontWeight: '700',
  },
  planPeriod: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
  ctaSection: {
    gap: 12,
    alignItems: 'center',
    paddingBottom: 20,
  },
  restoreLink: {
    paddingVertical: 6,
  },
  restoreLinkText: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    textDecorationLine: 'underline',
  },
  termsText: {
    ...typography.bodySm,
    fontSize: 10,
    color: colors.outline,
    textAlign: 'center',
    lineHeight: 14,
    maxWidth: 300,
  },
});
