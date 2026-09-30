/**
 * SplashScreen
 * Logo in the centre, green progress bar (Figma: 376x8, left/right 32, radius 4)
 * and "INITIALIZING SECURE CONNECTION" text at the bottom.
 * The bar fills from 0 to 100% over `duration` ms, then `onFinish` is called.
 */
import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
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
  /** Called when the bar reaches 100%. Use it to go to the next screen. */
  onFinish?: () => void;
  /** How long the bar takes to fill, in milliseconds. */
  duration?: number;
  statusText?: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 2500,
  statusText = 'INITIALIZING SECURE CONNECTION',
}) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width can't use the native driver
    });

    animation.start(({finished}) => {
      if (finished) {
        onFinish?.();
      }
    });

    return () => animation.stop();
  }, [progress, duration, onFinish]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
    width: 240,
    height: 240,
  },
  bottomContainer: {
    paddingHorizontal: 32,      // Figma: Left 32
    paddingBottom: 40,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',              // Figma: Width 376 (440 - 32 - 32)
    height: 8,                  // Figma: Height 8
    borderRadius: 4,            // Figma: Radius 4
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primaryGreen,
  },
  statusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default SplashScreen;