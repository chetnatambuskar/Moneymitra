import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';
import {FinalLoanDetails, MOCK_FINAL_LOAN_DETAILS} from '../data/finalLoanDetails';

interface FinalLoanDetailsScreenProps {
  details?: FinalLoanDetails;
  onBack?: () => void;
}

const DetailRow: React.FC<{
  label: string;
  value: string;
  bold?: boolean;
}> = ({label, value, bold}) => (
  <View style={styles.row}>
    <Text style={[styles.rowLabel, bold && styles.rowLabelBold]}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const FinalLoanDetailsScreen: React.FC<FinalLoanDetailsScreenProps> = ({
  details = MOCK_FINAL_LOAN_DETAILS,
  onBack,
}) => {
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
        <Text style={styles.headerTitle}>Final Loan Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <DetailRow label="Lending Partner" value={details.lendingPartner} />
          <DetailRow label="Loan Amount" value={details.loanAmount} />
          <DetailRow
            label="Processing Fee (with taxes)"
            value={details.processingFee}
          />
          <DetailRow label="Pre-EMI" value={details.preEmi} />

          <View style={styles.transferRow}>
            <View style={styles.transferLabelBlock}>
              <Text style={styles.transferLabel}>Amount Transferrable</Text>
              <Text style={styles.transferSubLabel}>
                {details.amountTransferrableNote}
              </Text>
            </View>
            <Text style={styles.rowValue}>Loan Amount</Text>
          </View>

          <View style={styles.divider} />

          <DetailRow label="Loan Tenure" value={details.loanTenure} />
          <DetailRow label="Monthly EMI" value={details.monthlyEmi} />
          <DetailRow label="1st EMI Date" value={details.firstEmiDate} />
          <DetailRow label="Interest Rate" value={details.interestRate} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  rowLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  rowLabelBold: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  rowValue: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  transferLabelBlock: {
    flexShrink: 1,
    paddingRight: 12,
  },
  transferLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  transferSubLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 20,
  },
});

export default FinalLoanDetailsScreen;