import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';

interface LoginScreenProps {
  onContinue?: (mobileNumber: string) => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTerms?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onContinue,
  onOpenPrivacyPolicy,
  onOpenTerms,
}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [agreed, setAgreed] = useState(true);

  const isValidNumber = mobileNumber.length === 10;
  const canContinue = isValidNumber && agreed;

  const handleContinue = () => {
    if (canContinue) {
      onContinue?.(mobileNumber);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Text style={styles.logo}>
            <Text style={styles.logoBlue}>Money</Text>
            <Text style={styles.logoGreen}>Mitra</Text>
          </Text>

          <Text style={styles.heading}>Login / Signup</Text>

          <Text style={styles.label}>Enter Your Mobile Number</Text>

          <View style={styles.inputRow}>
            <Text style={styles.countryCode}>+91-</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Mobile Number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              maxLength={10}
              value={mobileNumber}
              onChangeText={text =>
                setMobileNumber(text.replace(/[^0-9]/g, ''))
              }
            />
          </View>

          <View style={styles.termsRow}>
            <TouchableOpacity
              style={[styles.checkbox, agreed && styles.checkboxChecked]}
              onPress={() => setAgreed(prev => !prev)}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              {agreed && (
                <Ionicons name="checkmark" size={13} color={colors.white} />
              )}
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing, I agree{' '}
              <Text style={styles.link} onPress={onOpenPrivacyPolicy}>
                Privacy Policy
              </Text>{' '}
              and{' '}
              <Text style={styles.link} onPress={onOpenTerms}>
                Terms & Conditions
              </Text>{' '}
              and receive communication via SMS, E-mail.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          activeOpacity={0.85}
          disabled={!canContinue}
          onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  logo: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
  },
  logoBlue: {
    color: colors.primaryBlue,
  },
  logoGreen: {
    color: colors.primaryGreen,
  },
  heading: {
    fontSize: 18,
    lineHeight: 18,
    letterSpacing: 0,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  countryCode: {
    fontSize: 16,
    color: colors.textSecondary,
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    padding: 0,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primaryGreen,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  link: {
    color: colors.primaryGreen,
    fontWeight: '600',
  },
  continueButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});

export default LoginScreen;
