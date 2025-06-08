import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Image } from 'react-native';
import Colors from '@/constants/colors';

interface OnboardingSlideProps {
  title: string;
  description: string;
  image: string;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ title, description, image }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <Image
        source={{ uri: image }}
        style={[styles.image, { width: width * 0.8, height: width * 0.8 }]}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
});

export default OnboardingSlide;