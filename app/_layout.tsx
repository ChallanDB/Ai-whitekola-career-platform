import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useSettingsStore } from '@/store/settingsStore';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq7vEg7cInP8D4tIEJrj3HuhTwZrzN7vw",
  authDomain: "whitekola-47d90.firebaseapp.com",
  projectId: "whitekola-47d90",
  storageBucket: "whitekola-47d90.firebasestorage.app",
  messagingSenderId: "1067071420460",
  appId: "1:1067071420460:web:c4f48436f0be1f07be7989"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { darkMode } = useSettingsStore();
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: darkMode ? '#121212' : '#FFFFFF',
        },
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="auth/index" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="job/[id]" options={{ headerShown: true, title: 'Job Details' }} />
        <Stack.Screen name="job/post" options={{ headerShown: true, title: 'Post a Job' }} />
        <Stack.Screen name="cv/create" options={{ headerShown: true, title: 'Create CV' }} />
        <Stack.Screen name="counseling/book" options={{ headerShown: true, title: 'Book Counseling' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}