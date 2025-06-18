import React from 'react';
import { Stack } from 'expo-router';
import { useSettingsStore } from '@/store/settingsStore';
import Colors from '@/constants/colors';

export default function AuthLayout() {
  const { darkMode } = useSettingsStore();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: darkMode ? Colors.dark.background : Colors.background,
        },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}