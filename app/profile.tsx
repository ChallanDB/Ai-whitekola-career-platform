import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';

export default function ProfileRedirect() {
  // This is a redirect file to handle any direct navigation to /profile
  return <Redirect href="/(tabs)/profile" />;
}