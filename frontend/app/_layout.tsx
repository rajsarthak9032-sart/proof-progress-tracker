import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { PurchasesProvider } from '../src/context/PurchasesContext';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PurchasesProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.surface },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/login" options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="(auth)/verify-email" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/forgot-password" options={{ headerShown: false }} />
            <Stack.Screen name="journey/create" options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="journey/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="evidence/add" options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="compare/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="paywall" options={{ headerShown: false, presentation: 'modal' }} />
          </Stack>
        </PurchasesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
