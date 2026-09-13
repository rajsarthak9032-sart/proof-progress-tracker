import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../../src/theme';
import { ProofHeader, Button } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { usePurchases } from '../../src/context/PurchasesContext';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isDemoMode, setDemoMode, signOut } = useAuth();
  const { isPro, restorePurchases } = usePurchases();

  const handleRestore = async () => {
    const res = await restorePurchases();
    if (res.success) {
      Alert.alert('Purchases Restored', 'Your Proof Pro entitlement was restored successfully.');
    } else {
      Alert.alert('Restore Purchases', res.error || 'No active Proof Pro subscription was found on this store account.');
    }
  };

  return (
    <View style={styles.screen}>
      <ProofHeader
        title="Proof"
        subtitle="Profile"
        dayLabel="DAY 30"
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 96 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={[styles.userCard, shadows.level1]}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2A_-8aH7PYKu7bjCjnVw5CfF-CjOw1fQ1yayI5NNWhNR3PXAezpvg_FfynQf4Xa7q1epBzA1pN6X4t7OxI1DFiSJ1oN1HzYBNrl6M08qKVYdf67aLUA3E-Urcui6v9itVMSapWSjYQqwBrzRiSvrHYxnRphYaFlTJ2FRkRRWjbMMgGfNX1vb6f6n6bIiztzwGP7WRZJheVUUWs-L6fB7ytp5EqxQWXBc9q0k4HFcX-agDvYuwRxSHRw',
            }}
            style={styles.userAvatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.email?.split('@')[0] || 'Curator Elena'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'elena.curator@craft.studio'}</Text>
            <View style={styles.tierRow}>
              {isPro ? (
                <View style={styles.proBadge}>
                  <MaterialIcons name="verified" size={12} color="#FFFFFF" />
                  <Text style={styles.proBadgeText}>PROOF PRO</Text>
                </View>
              ) : (
                <View style={styles.freeBadge}>
                  <Text style={styles.freeBadgeText}>FREE TIER</Text>
                </View>
              )}
              {isDemoMode && (
                <View style={styles.demoBadge}>
                  <Text style={styles.demoBadgeText}>DEMO MODE</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Stats Summary Strip */}
        <View style={[styles.statsCard, shadows.level1]}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Active Journeys</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>14</Text>
            <Text style={styles.statLabel}>Proof Evidences</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Milestones</Text>
          </View>
        </View>

        {/* Proof Pro Subscription Card */}
        <View style={[styles.proCard, shadows.level2]}>
          <View style={styles.proHeader}>
            <View style={styles.proIconCircle}>
              <MaterialIcons name="auto-awesome" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.proTitleCol}>
              <Text style={styles.proTitle}>Proof Pro</Text>
              <Text style={styles.proDesc}>
                {isPro
                  ? 'Unlimited journeys, advanced Time Travel, and full AI insights active.'
                  : 'Unlock unlimited Journeys, advanced Time Travel, and AI progress synthesis.'}
              </Text>
            </View>
          </View>

          {!isPro ? (
            <Button
              title="Upgrade to Proof Pro"
              onPress={() => router.push('/paywall')}
              variant="aurora"
              style={styles.upgradeBtn}
            />
          ) : (
            <View style={styles.activeProBox}>
              <MaterialIcons name="check-circle" size={18} color={colors.secondaryContainer} />
              <Text style={styles.activeProText}>Entitlement proof_pro active</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleRestore}
            style={styles.restoreBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>
        </View>

        {/* Settings & Evaluation Controls */}
        <View style={[styles.settingsGroup, shadows.level1]}>
          <Text style={styles.groupHeader}>DEMO & EVALUATION</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Demo Mode</Text>
              <Text style={styles.settingDesc}>
                Inspect pre-loaded Learning Digital Art competition dataset.
              </Text>
            </View>
            <Switch
              value={isDemoMode}
              onValueChange={setDemoMode}
              trackColor={{ false: colors.surfaceContainerHigh, true: colors.secondaryContainer }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Sign In / Sign Out */}
        <View style={styles.authGroup}>
          {!user ? (
            <Button
              title="Sign In with Supabase"
              onPress={() => router.push('/(auth)/login')}
              variant="secondary"
            />
          ) : (
            <Button
              title="Sign Out"
              onPress={signOut}
              variant="outline"
            />
          )}
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
    paddingTop: 16,
    gap: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 24,
    padding: 18,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.surfaceContainerHigh,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.headlineSm,
    color: colors.onSurface,
  },
  userEmail: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  tierRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  proBadgeText: {
    ...typography.labelCaps,
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  freeBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  freeBadgeText: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.onSurfaceVariant,
  },
  demoBadge: {
    backgroundColor: colors.secondaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  demoBadgeText: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.onSecondaryFixed,
    fontWeight: '700',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  statLabel: {
    ...typography.monoMetric,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.surfaceContainer,
  },
  proCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  proHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  proIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proTitleCol: {
    flex: 1,
  },
  proTitle: {
    ...typography.headlineSm,
    color: '#FFFFFF',
  },
  proDesc: {
    ...typography.bodySm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    lineHeight: 18,
  },
  upgradeBtn: {
    width: '100%',
  },
  activeProBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 14,
  },
  activeProText: {
    ...typography.monoMetric,
    color: '#FFFFFF',
    fontSize: 12,
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  restoreText: {
    ...typography.labelCaps,
    color: 'rgba(255, 255, 255, 0.65)',
    textDecorationLine: 'underline',
  },
  settingsGroup: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
    gap: 14,
  },
  groupHeader: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextCol: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    ...typography.headlineSm,
    fontSize: 15,
    color: colors.onSurface,
  },
  settingDesc: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  authGroup: {
    marginTop: 8,
    paddingBottom: 24,
  },
});
