import React from 'react';
import {Image, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../theme/colors';

interface DocVerificationReviewScreenProps {
  photoUri: string;
  onRetake: () => void;
  onConfirm: () => void;
}

const DocVerificationReviewScreen: React.FC<DocVerificationReviewScreenProps> = ({
  photoUri,
  onRetake,
  onConfirm,
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <View style={styles.illustrationBox}>
          <View style={styles.photoCircle}>
            <Image source={{uri: photoUri}} style={styles.photo} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.retakeButton}
          activeOpacity={0.7}
          onPress={onRetake}>
          <Text style={styles.retakeText}>Retake Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.85}
          onPress={onConfirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  illustrationBox: {
    backgroundColor: '#D7EEDB',
    borderRadius: 20,
    height: 340,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primaryGreen,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  retakeButton: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  retakeText: {
    color: colors.primaryGreen,
    fontSize: 17,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  confirmButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default DocVerificationReviewScreen;