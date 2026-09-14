import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, isDemoMode } = useAuth();

  useEffect(() => {
    if (!loading && !isDemoMode && !user) {
      // User is not authenticated and not in demo mode
      // Redirect to onboarding/login
      router.replace('/(auth)/onboarding');
    }
  }, [user, loading, isDemoMode, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  // Allow access if:
  // 1. User is authenticated (has session)
  // 2. User is in demo mode
  // 3. Still loading (handled above)
  if (!user && !isDemoMode) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
});