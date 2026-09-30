import React, {useEffect, useRef, useState} from 'react';
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

const OTP_LENGTH = 6;
const RESEND_SECONDS = 59;

interface OtpVerificationScreenProps {
  mobileNumber: string;
  onVerify?: (otp: string) => void;
  onChangeNumber?: () => void;
  onResendOtp?: () => void;
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  mobileNumber,
  onVerify,
  onChangeNumber,
  onResendOtp,
}) => {
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const canVerify = otp.length === OTP_LENGTH;
  const canResend = secondsLeft === 0;

  const handleVerify = () => {
    if (canVerify) {
      onVerify?.(otp);
    }
  };

  const handleResend = () => {
    if (canResend) {
      setSecondsLeft(RESEND_SECONDS);
      onResendOtp?.();
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

          <Text style={styles.heading}>Verify Mobile Number</Text>

          <Text style={styles.subLabel}>
            Enter Your 6 Digit OTP Sent On Your mobile Number
          </Text>

          <View style={styles.numberRow}>
            <Text style={styles.numberText}>{mobileNumber}</Text>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={onChangeNumber}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Ionicons
                name="create-outline"
                size={14}
                color={colors.primaryGreen}
                style={styles.pencil}
              />
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.otpRow}>
            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              value={otp}
              onChangeText={text => setOtp(text.replace(/[^0-9]/g, ''))}
            />
            {canResend ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendText}>Resend</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, !canVerify && styles.verifyButtonDisabled]}
          activeOpacity={0.85}
          disabled={!canVerify}
          onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verify OTP</Text>
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
  subLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  numberText: {
    fontSize: 15,
    color: colors.textPrimary,
    marginRight: 8,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pencil: {
    fontSize: 13,
    marginRight: 4,
  },
  changeText: {
    fontSize: 15,
    color: colors.primaryGreen,
    fontWeight: '600',
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  otpInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    padding: 0,
  },
  timerText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  resendText: {
    fontSize: 15,
    color: colors.primaryGreen,
    fontWeight: '700',
  },
  verifyButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});

export default OtpVerificationScreen;
