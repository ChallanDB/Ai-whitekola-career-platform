import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Briefcase, User } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

export default function TabLayout() {
  const { darkMode } = useSettingsStore();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: darkMode ? Colors.dark.subtext : Colors.subtext,
        tabBarStyle: {
          backgroundColor: darkMode ? Colors.dark.card : 'white',
          borderTopColor: darkMode ? Colors.dark.border : Colors.border,
        },
        headerStyle: {
          backgroundColor: darkMode ? Colors.dark.card : 'white',
        },
        headerTintColor: darkMode ? Colors.dark.text : Colors.text,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'WhiteKola',
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
          headerTitle: 'Career Learning',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
}