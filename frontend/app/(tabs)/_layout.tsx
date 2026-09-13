import React from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { FloatingNavBar, TabName } from '../../src/components';
import { colors } from '../../src/theme';

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = (): TabName => {
    if (pathname.includes('time-travel')) return 'time-travel';
    if (pathname.includes('stories')) return 'stories';
    if (pathname.includes('profile')) return 'profile';
    return 'journeys';
  };

  const handleTabChange = (tab: TabName) => {
    if (tab === 'journeys') router.replace('/(tabs)');
    if (tab === 'time-travel') router.replace('/(tabs)/time-travel');
    if (tab === 'stories') router.replace('/(tabs)/stories');
    if (tab === 'profile') router.replace('/(tabs)/profile');
  };

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Custom FloatingNavBar is rendered below
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="time-travel" />
        <Tabs.Screen name="stories" />
        <Tabs.Screen name="profile" />
      </Tabs>
      <FloatingNavBar activeTab={getActiveTab()} onTabChange={handleTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    position: 'relative',
  },
});
