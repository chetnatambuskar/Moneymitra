import React from 'react';
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
import colors from '../theme/colors';
import {
  REVIEW_LOAN_BOTTOM_ROWS,
  REVIEW_LOAN_TOP_ROWS,
  ReviewRow,
} from '../data/loanAgreement';

interface Props {
  topRows?: ReviewRow[];
  bottomRows?: ReviewRow[];
  onBack?: () => void;
  onContinue?: () => void;
}

const Row: React.FC<{row: ReviewRow}> = ({row}) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <Text style={row.bold ? styles.labelBold : styles.label}>{row.label}</Text>
      {row.caption && <Text style={styles.caption}>{row.caption}</Text>}
    </View>
    <Text style={styles.value}>{row.value}</Text>
  </View>
);

const ReviewLoanDetailsScreen: React.FC<Props> = ({
  topRows = REVIEW_LOAN_TOP_ROWS,
  bottomRows = REVIEW_LOAN_BOTTOM_ROWS,
  onBack,
  onContinue,
}) => (
  <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
    <StatusBar barStyle="dark-content" />
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
        <Ionicons name="arrow-back" size={22} color={colors.primaryGreen} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Review Loan Details</Text>
      <View style={styles.backButton} />
    </View>

    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        {topRows.map(r => (
          <Row key={r.label} row={r} />
        ))}
        <View style={styles.divider} />
        {bottomRows.map(r => (
          <Row key={r.label} row={r} />
        ))}
      </View>
    </ScrollView>

    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.85}
      onPress={onContinue}>
      <Text style={styles.buttonText}>Continue</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.white},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {width: 32},
  headerTitle: {fontSize: 18, fontWeight: '700', color: colors.textPrimary},
  content: {paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16},
  card: {
    borderWidth: 1,
    borderColor: colors.tabInactive,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  rowLeft: {flex: 1, paddingRight: 12},
  // Figma: Inter Regular, 16px, line-height 16, #757575
  label: {fontSize: 16, lineHeight: 16, color: colors.textSecondary},
  labelBold: {fontSize: 16, lineHeight: 16, fontWeight: '700', color: '#000000'},
  caption: {fontSize: 14, color: colors.textSecondary, marginTop: 8},
  value: {fontSize: 16, lineHeight: 16, color: colors.textSecondary},
  divider: {height: 1, backgroundColor: '#E0E0E0', marginVertical: 22},
  button: {
    marginHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {color: colors.white, fontSize: 18, fontWeight: '700'},
});

export default ReviewLoanDetailsScreen;