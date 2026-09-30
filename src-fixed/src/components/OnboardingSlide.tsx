import React from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../theme/colors';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const IMAGE_HEIGHT_RATIO = 0.6; // top image takes ~60% of the slide height

export interface OnboardingSlideData {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
}

interface OnboardingSlideProps {
  slide: OnboardingSlideData;
  showSkip: boolean;
  onSkip: () => void;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  slide,
  showSkip,
  onSkip,
}) => {
  return (
    <View style={styles.slide}>
      <View style={styles.imageWrapper}>
        <Image source={slide.image} style={styles.image} resizeMode="cover" />

        {/* Poor-man's gradient: stacked, increasingly opaque white bands
            fade the photo into the white content area below, matching the
            soft fade at the bottom of the design frame. */}
        <View style={styles.fadeContainer} pointerEvents="none">
          {[0.08, 0.18, 0.32, 0.5, 0.72, 1].map((opacity, index) => (
            <View
              key={index}
              style={[styles.fadeBand, {opacity}]}
            />
          ))}
        </View>

        {showSkip && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  imageWrapper: {
    width: '100%',
    height: `${IMAGE_HEIGHT_RATIO * 100}%`,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fadeContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '35%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  fadeBand: {
    flex: 1,
    backgroundColor: colors.white,
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 20,
  },
  skipText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 28,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 30,
    color: colors.primaryGreen,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});

export default OnboardingSlide;
