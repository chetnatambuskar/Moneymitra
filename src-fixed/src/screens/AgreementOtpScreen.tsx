import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../theme/colors';

interface Props {
  onBack?: () => void;
  onVerify?: (otp: string) => void;
}

const OTP_LENGTH = 6;

const AgreementOtpScreen: React.FC<Props> = ({onVerify}) => {
  const [otp, setOtp] = useState('');
  const canVerify = otp.length === OTP_LENGTH;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.body}>
          <Text style={styles.label}>OTP</Text>
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={t => setOtp(t.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            autoFocus
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
          />
        </View>
        <TouchableOpacity
          style={[styles.button, !canVerify && styles.buttonDisabled]}
          activeOpacity={0.85}
          disabled={!canVerify}
          onPress={() => onVerify?.(otp)}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.white},
  flex: {flex: 1},
  body: {flex: 1, paddingHorizontal: 16, paddingTop: 48},
  label: {fontSize: 14, color: colors.textSecondary, marginBottom: 10},
  // Figma: 0.5px #757575 underline
  input: {
    fontSize: 18,
    color: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.tabInactive,
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {opacity: 0.5},
  buttonText: {color: colors.white, fontSize: 18, fontWeight: '700'},
});

export default AgreementOtpScreen;