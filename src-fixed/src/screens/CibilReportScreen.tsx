import React, {useState} from 'react';
import {
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
          onChangeText={setOtp}
          keyboardType="number-pad"
          placeholderTextColor={colors.textSecondary}
          maxLength={6}
        />
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.footerButton}
          activeOpacity={0.85}
          onPress={onBack}>
          <Text style={styles.footerButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          activeOpacity={0.85}
          onPress={() => onNext?.(otp)}>
          <Text style={styles.footerButtonText}>Next</Text>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: {
    width: 32,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryGreen,
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
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
  footerButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CibilReportScreen;
