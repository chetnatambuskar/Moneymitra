/**
 * SplashScreen
 * Recreated from the provided MoneyMitra design (logo + progress bar +
 * "INITIALIZING SECURE CONNECTION" status text).
 */
import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../theme/colors';

const LOGO = require('../assets/images/logo.png');

interface SplashScreenProps {
  /** Progress from 0 to 1. Defaults to an indeterminate-looking animation. */
  progress?: number;
  /** Text shown under the progress bar. */
  statusText?: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  progress = 0.28,
  statusText = 'INITIALIZING SECURE CONNECTION',
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [animatedWidth, progress]);

  const barWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.logoContainer}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, {width: barWidth}]} />
        </View>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
  bottomContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 48,
  },
  progressTrack: {
    width: 180,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.primaryGreen,
  },
  statusText: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default SplashScreen;
