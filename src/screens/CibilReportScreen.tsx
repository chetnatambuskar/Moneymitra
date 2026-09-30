// Replace: src/screens/CibilReportScreen.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';
import {cibilApi} from '../services/api';

interface CibilReportScreenProps {
  initialOtp?: string;
  onBack?: () => void;
  onNext?: (otp: string) => void;
}

const CibilReportScreen: React.FC<CibilReportScreenProps> = ({
  initialOtp,
  onBack,
  onNext,
}) => {
  const [otp, setOtp] = useState(initialOtp ?? '');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const requestOtp = useCallback(async () => {
    try {
      setSending(true);
      const res = await cibilApi.sendOtp();
      if (res.otp) {
        // Backend is in OTP_DEBUG_MODE: show the code and auto-fill it.
        setDevOtp(res.otp);
        setOtp(res.otp);
      }
    } catch (e: any) {
      Alert.alert('Could not send OTP', e?.message || 'Please try again.');
    } finally {
      setSending(false);
    }
  }, []);

  // Send the OTP as soon as the screen opens.
  useEffect(() => {
    requestOtp();
  }, [requestOtp]);

  const handleNext = async () => {
    if (otp.length !== 6) {
      Alert.alert('Enter the 6 digit OTP');
      return;
    }
    try {
      setVerifying(true);
      await cibilApi.verifyOtp(otp);
      onNext?.(otp);
    } catch (e: any) {
      Alert.alert('Verification failed', e?.message || 'Incorrect OTP.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Ionicons name="arrow-back" size={22} color={colors.primaryGreen} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionHeading}>CIBIL Report</Text>

        <Text style={styles.label}>OTP</Text>
        <TextInput
          style={styles.input}
          value={otp}
          onChangeText={t => setOtp(t.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          placeholder="Enter 6 digit OTP"
          placeholderTextColor={colors.textSecondary}
          maxLength={6}
        />

        {devOtp ? (
          <Text style={styles.devOtp}>Dev OTP: {devOtp}</Text>
        ) : null}

        <TouchableOpacity
          onPress={requestOtp}
          disabled={sending}
          style={styles.resend}>
          {sending ? (
            <ActivityIndicator color={colors.primaryGreen} />
          ) : (
            <Text style={styles.resendText}>Resend OTP</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.footerButton}
          activeOpacity={0.85}
          onPress={onBack}>
          <Text style={styles.footerButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, verifying && {opacity: 0.6}]}
          activeOpacity={0.85}
          disabled={verifying}
          onPress={handleNext}>
          {verifying ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.footerButtonText}>Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.white},
  header: {paddingHorizontal: 16, paddingTop: 12},
  backButton: {width: 32},
  scrollContent: {flexGrow: 1, paddingHorizontal: 16, paddingTop: 8},
  sectionHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryGreen,
    marginBottom: 24,
  },
  label: {fontSize: 13, color: colors.textSecondary, marginBottom: 8},
  input: {
    fontSize: 16,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  devOtp: {marginTop: 12, fontSize: 13, color: colors.textSecondary},
  resend: {marginTop: 16, alignSelf: 'flex-start'},
  resendText: {color: colors.primaryGreen, fontSize: 14, fontWeight: '600'},
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  footerButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonText: {color: colors.white, fontSize: 16, fontWeight: '700'},
});

export default CibilReportScreen;