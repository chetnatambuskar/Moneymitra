import React, {useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';
import {
  InsurancePaymentData,
  MOCK_INSURANCE_PAYMENT,
} from '../data/insurancePayment';
import {BankDetailsFormData} from './BankDetailsScreen';

interface PaymentForInsuranceScreenProps {
  data?: InsurancePaymentData;
  bankDetails?: BankDetailsFormData;
  onBack?: () => void;
  onEditBank?: () => void;
  onPressChargesInfo?: () => void;
  onPay?: () => void;
}

interface CheckRowProps {
  checked: boolean;
  label: string;
  onToggle: () => void;
}

const CheckRow: React.FC<CheckRowProps> = ({checked, label, onToggle}) => (
  <View style={styles.checkRow}>
    <TouchableOpacity
      style={[styles.checkbox, checked && styles.checkboxChecked]}
      onPress={onToggle}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
      {checked && <Ionicons name="checkmark" size={13} color={colors.white} />}
    </TouchableOpacity>
    <Text style={styles.checkText}>{label}</Text>
  </View>
);

const PaymentForInsuranceScreen: React.FC<PaymentForInsuranceScreenProps> = ({
  data = MOCK_INSURANCE_PAYMENT,
  bankDetails,
  onBack,
  onEditBank,
  onPressChargesInfo,
  onPay,
}) => {
  const [reviewed, setReviewed] = useState(false);
  const [bankConfirmed, setBankConfirmed] = useState(false);
  const [feeAgreed, setFeeAgreed] = useState(false);

  const canPay = reviewed && bankConfirmed && feeAgreed;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.loanHeader}>
          <MaterialCommunityIcons
            name="sack"
            size={36}
            color={colors.primaryGreen}
          />
          <View style={styles.loanHeaderText}>
            <Text style={styles.loanTitle}>{data.loanTitle}</Text>
            <Text style={styles.loanSubtitle}>{data.loanSubtitle}</Text>
          </View>
          <Text style={styles.headlineAmount}>{data.headlineAmount}</Text>
        </View>

        <View style={styles.summaryCard}>
          {data.rows.map(row => (
            <View key={row.label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <CheckRow
          checked={reviewed}
          onToggle={() => setReviewed(p => !p)}
          label="I have reviewed and confirmed the information provided."
        />

        <View style={styles.chargesHeader}>
          <Text style={styles.chargesTitle}>Additional Charges</Text>
          <Text style={styles.clickHere} onPress={onPressChargesInfo}>
            Click Here
          </Text>
        </View>
        <View style={styles.insuranceRow}>
          <Text style={styles.summaryLabel}>Insurance</Text>
          <Text style={styles.summaryLabel}>{data.insuranceCharge}</Text>
        </View>

        <View style={styles.bankCard}>
          <View style={styles.bankCardHeader}>
            <Text style={styles.bankCardTitle}>Bank Details</Text>
            <Text style={styles.editLink} onPress={onEditBank}>
              Edit
            </Text>
          </View>
          <Text style={styles.bankPrimary}>{bankDetails?.bankName || '—'}</Text>
          <Text style={styles.bankPrimary}>
            {bankDetails?.accountHolderName || '—'}
          </Text>
          <Text style={styles.bankSecondary}>
            Account Number {bankDetails?.accountNumber || '—'}
          </Text>
          <Text style={styles.bankSecondary}>
            IFSC Code {bankDetails?.ifscCode || '—'}
          </Text>
        </View>

        <CheckRow
          checked={bankConfirmed}
          onToggle={() => setBankConfirmed(p => !p)}
          label="I confirm that the bank details are correct and belong to me."
        />

        <View style={styles.totalRow}>
          <Text style={styles.totalAmount}>{data.insuranceCharge}</Text>
          <Text style={styles.totalLabel}>Insurance Charges</Text>
        </View>

        <CheckRow
          checked={feeAgreed}
          onToggle={() => setFeeAgreed(p => !p)}
          label="Agree to pay the required fee to proceed with my application."
        />
      </ScrollView>

      <TouchableOpacity
        style={[styles.payButton, !canPay && styles.payButtonDisabled]}
        activeOpacity={0.85}
        disabled={!canPay}
        onPress={onPay}>
        <Text style={styles.payButtonText}>Pay To Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.white},
  flex: {flex: 1},
  header: {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8},
  backButton: {width: 32},
  scrollContent: {paddingHorizontal: 16, paddingBottom: 16},
  loanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  loanHeaderText: {flex: 1, marginLeft: 12},
  loanTitle: {fontSize: 20, fontWeight: '700', color: colors.primaryGreen},
  loanSubtitle: {fontSize: 16, color: colors.textSecondary, marginTop: 2},
  headlineAmount: {fontSize: 28, fontWeight: '700', color: colors.primaryGreen},
  summaryCard: {
    borderWidth: 1,
    borderColor: colors.tabInactive,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  summaryLabel: {fontSize: 14, color: colors.textSecondary},
  summaryValue: {fontSize: 14, color: colors.textSecondary},
  checkRow: {flexDirection: 'row', alignItems: 'center', marginVertical: 6},
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {backgroundColor: colors.primaryGreen},
  // Figma: Inter Regular, 12px, #000000
  checkText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0,
    color: '#000000',
  },
  chargesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 26,
  },
  chargesTitle: {fontSize: 20, fontWeight: '700', color: colors.primaryGreen},
  clickHere: {fontSize: 16, color: colors.primaryGreen},
  insuranceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 26,
  },
  bankCard: {
    backgroundColor: '#D1E9D5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  bankCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bankCardTitle: {fontSize: 18, fontWeight: '700', color: colors.textPrimary},
  editLink: {fontSize: 15, color: colors.primaryGreen},
  bankPrimary: {fontSize: 16, color: colors.textPrimary, marginBottom: 6},
  bankSecondary: {fontSize: 16, color: colors.textSecondary, marginBottom: 6},
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 22,
    marginBottom: 8,
  },
  totalAmount: {fontSize: 44, fontWeight: '700', color: colors.primaryGreen},
  totalLabel: {fontSize: 16, color: colors.textSecondary, marginLeft: 10},
  payButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: {opacity: 0.5},
  payButtonText: {color: colors.white, fontSize: 18, fontWeight: '700'},
});

export default PaymentForInsuranceScreen;