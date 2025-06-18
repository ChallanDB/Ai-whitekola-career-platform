import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import Colors from '@/constants/colors';

// Import Firebase config to ensure it's initialized early
import '@/config/firebase';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const { hasCompletedOnboarding } = useOnboardingStore();

  useEffect(() => {
    // Wait for auth to initialize
    if (isLoading) return;
    
    // Simulate a loading delay
    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else if (!isAuthenticated) {
        router.replace('/(auth)');
      } else {
        router.replace('/(tabs)');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding, isAuthenticated, isLoading, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});