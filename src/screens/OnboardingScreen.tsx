// import React, {useRef, useState} from 'react';
// import {
//   Dimensions,
//   FlatList,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import OnboardingSlide, {
//   OnboardingSlideData,
// } from '../components/OnboardingSlide';
// import PaginationDots from '../components/PaginationDots';
// import colors from '../theme/colors';

// const {width: SCREEN_WIDTH} = Dimensions.get('window');

// const SLIDES: OnboardingSlideData[] = [
//   {
//     id: '1',
//     image: require('../assets/images/onboarding-1.jpg'),
//     title: 'Easy Loan Process',
//     description:
//       'Apply in minutes, get approved quickly, and receive funds without the hassle.',
//   },
//   {
//     id: '2',
//     image: require('../assets/images/onboarding-2.jpg'),
//     title: 'EMI Based Repayment',
//     description:
//       'Repay your loan through affordable monthly installments that fit your budget.',
//   },
//   {
//     id: '3',
//     image: require('../assets/images/onboarding-3.jpg'),
//     title: 'Secure KYC Verification',
//     description:
//       'Verify your identity securely in minutes for a faster and safer loan approval process.',
//   },
// ];

// interface OnboardingScreenProps {
//   onDone?: () => void;
// }

// const OnboardingScreen: React.FC<OnboardingScreenProps> = ({onDone}) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const listRef = useRef<FlatList<OnboardingSlideData>>(null);
//   const isFirstSlide = activeIndex === 0;
//   const isLastSlide = activeIndex === SLIDES.length - 1;

//   const goToIndex = (index: number) => {
//     listRef.current?.scrollToIndex({index, animated: true});
//     setActiveIndex(index);
//   };

//   const handleNext = () => {
//     if (isLastSlide) {
//       onDone?.();
//     } else {
//       goToIndex(activeIndex + 1);
//     }
//   };

//   const handleBack = () => {
//     if (!isFirstSlide) {
//       goToIndex(activeIndex - 1);
//     }
//   };

//   const handleSkip = () => {
//     onDone?.();
//   };

//   const handleMomentumScrollEnd = (
//     event: NativeSyntheticEvent<NativeScrollEvent>,
//   ) => {
//     const index = Math.round(
//       event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
//     );
//     setActiveIndex(index);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       <FlatList
//         ref={listRef}
//         data={SLIDES}
//         keyExtractor={item => item.id}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onMomentumScrollEnd={handleMomentumScrollEnd}
//         renderItem={({item}) => (
//           <OnboardingSlide slide={item} showSkip onSkip={handleSkip} />
//         )}
//       />

//       <View style={styles.footer}>
//         <PaginationDots total={SLIDES.length} activeIndex={activeIndex} />

//         <View style={styles.buttonsRow}>
//           {!isFirstSlide && (
//             <TouchableOpacity
//               style={styles.backButton}
//               activeOpacity={0.85}
//               onPress={handleBack}>
//               <Text style={styles.backButtonText}>Back</Text>
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity
//             style={styles.nextButton}
//             activeOpacity={0.85}
//             onPress={handleNext}>
//             <Text style={styles.nextButtonText}>
//               {isLastSlide ? 'Start' : 'Next'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   footer: {
//     paddingHorizontal: 24,
//     paddingBottom: 32,
//     paddingTop: 8,
//   },
//   buttonsRow: {
//     flexDirection: 'row',
//     marginTop: 20,
//     gap: 12,
//   },
//   backButton: {
//     flex: 1,
//     height: 56,
//     borderRadius: 28,
//     borderWidth: 1.5,
//     borderColor: colors.primaryGreen,
//     backgroundColor: colors.white,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   backButtonText: {
//     color: colors.primaryGreen,
//     fontSize: 17,
//     fontWeight: '700',
//   },
//   nextButton: {
//     flex: 1,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: colors.primaryGreen,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   nextButtonText: {
//     color: colors.white,
//     fontSize: 17,
//     fontWeight: '700',
//   },
// });

// export default OnboardingScreen;

import React, {useRef, useState} from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import OnboardingSlide, {
  OnboardingSlideData,
} from '../components/OnboardingSlide';
import PaginationDots from '../components/PaginationDots';
import colors from '../theme/colors';
import fonts from '../theme/fonts';

// imageFrame = where the photo sits in the 440 px Figma frame. Values were
// measured by matching each photo against the exported design frames.
const SLIDES: OnboardingSlideData[] = [
  {
    id: '1',
    image: require('../assets/images/onboarding-1.jpg'),
    imageFrame: {width: 921, height: 614, left: -312, top: 0},
    title: 'Easy Loan Process',
    description:
      'Apply in minutes, get approved quickly, and receive funds without the hassle.',
  },
  {
    id: '2',
    image: require('../assets/images/onboarding-2.jpg'),
    imageFrame: {width: 921, height: 614, left: -206, top: 0},
    title: 'EMI Based Repayment',
    description:
      'Repay your loan through affordable monthly installments that fit your budget.',
  },
  {
    id: '3',
    image: require('../assets/images/onboarding-3.jpg'),
    imageFrame: {width: 440, height: 660, left: 0, top: -23},
    title: 'Secure KYC Verification',
    description:
      'Verify your identity securely in minutes for a faster and safer loan approval process.',
  },
];

interface OnboardingScreenProps {
  onDone?: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({onDone}) => {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<OnboardingSlideData>>(null);
  const isFirstSlide = activeIndex === 0;
  const isLastSlide = activeIndex === SLIDES.length - 1;

  const goToIndex = (index: number) => {
    listRef.current?.scrollToIndex({index, animated: true});
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (isLastSlide) {
      onDone?.();
    } else {
      goToIndex(activeIndex + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstSlide) {
      goToIndex(activeIndex - 1);
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  return (
    <View style={styles.container}>
      {/* Slide 3's photo is light, so its status bar is dark (Figma). */}
      <StatusBar
        barStyle={isLastSlide ? 'dark-content' : 'light-content'}
      />

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({item}) => <OnboardingSlide slide={item} />}
      />

      <TouchableOpacity
        style={[styles.skipButton, {top: insets.top + 10}]}
        onPress={onDone}
        hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 40}]}>
        <PaginationDots total={SLIDES.length} activeIndex={activeIndex} />

        <View style={styles.buttonsRow}>
          {!isFirstSlide && (
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              activeOpacity={0.85}
              onPress={handleBack}>
              <Text style={[styles.buttonText, styles.backButtonText]}>
                Back
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            activeOpacity={0.85}
            onPress={handleNext}>
            <Text style={[styles.buttonText, styles.nextButtonText]}>
              {isLastSlide ? 'Start' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  skipButton: {
    position: 'absolute',
    right: 16,
  },
  skipText: {
    fontFamily: fonts.medium,
    fontSize: 18,
    lineHeight: 22,
    color: colors.white,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 32, // dots (y 794-802) -> buttons (y 834)
    gap: 16,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    lineHeight: 22,
  },
  backButton: {
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    backgroundColor: colors.white,
  },
  backButtonText: {
    color: colors.primaryGreen,
  },
  nextButton: {
    backgroundColor: colors.primaryGreen,
  },
  nextButtonText: {
    color: colors.white,
  },
});

export default OnboardingScreen;
