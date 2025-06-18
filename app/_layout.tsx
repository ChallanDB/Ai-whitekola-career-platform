import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useSettingsStore } from '@/store/settingsStore';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from '@/store/authStore';
import { getUserData } from '@/utils/firebase';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq7vEg7cInP8D4tIEJrj3HuhTwZrzN7vw",
  authDomain: "whitekola-47d90.firebaseapp.com",
  projectId: "whitekola-47d90",
  storageBucket: "whitekola-47d90.appspot.com",
  messagingSenderId: "1067071420460",
  appId: "1:1067071420460:web:c4f48436f0be1f07be7989"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { darkMode } = useSettingsStore();
  const { setUser, setIsAuthenticated, setIsLoading } = useAuthStore();
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf'),
  });

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userData = await getUserData(firebaseUser.uid);
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // If no user data in Firestore, create basic user object
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              photoURL: firebaseUser.photoURL || undefined,
              hasCV: false
            });
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
        <Stack.Screen name="(auth)" options={{ headerShown: false, gestureEnabled: false }} />
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