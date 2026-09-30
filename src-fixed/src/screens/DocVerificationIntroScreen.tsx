import React from 'react';
import {Image, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';
import {DOC_VERIFICATION_CONFIG, DocVerificationType} from '../data/docVerificationConfig';

// Real illustration for the selfie flow (exported from Figma). Aadhaar/PAN
// still fall back to an icon below until their own illustrations are exported.
const SELFIE_ILLUSTRATION = require('../assets/images/selfie-illustration.png');

interface DocVerificationIntroScreenProps {
  docType: DocVerificationType;
  onBack?: () => void;
  onStartVerification: () => void;
}

const DocVerificationIntroScreen: React.FC<DocVerificationIntroScreenProps> = ({
  docType,
  onStartVerification,
}) => {
  const config = DOC_VERIFICATION_CONFIG[docType];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <View style={styles.illustrationBox}>
          {docType === 'selfie' ? (
            <View style={styles.illustrationCircle}>
              <Image source={SELFIE_ILLUSTRATION} style={styles.illustrationImage} />
            </View>
          ) : (
            <View style={styles.illustrationCircle}>
              <MaterialCommunityIcons
                name={config.icon}
                size={110}
                color={colors.primaryGreen}
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.85}
          onPress={onStartVerification}>
          <Text style={styles.startButtonText}>Start Verification</Text>
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
  illustrationCircle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  startButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default DocVerificationIntroScreen;