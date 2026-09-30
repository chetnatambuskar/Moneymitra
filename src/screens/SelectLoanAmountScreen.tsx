import React, {useMemo, useRef, useState} from 'react';
import {
  Animated,
  PanResponder,
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

const MIN_AMOUNT = 10000;
const MAX_AMOUNT = 500000;
const DEFAULT_AMOUNT = 150000;
const THUMB_SIZE = 24;

const TENURE_OPTIONS = [6, 12, 18, 24];

interface SelectLoanAmountScreenProps {
  initialAmount?: number;
  onBack?: () => void;
  onConfirm?: (amount: number, tenureMonths: number) => void;
}

const formatRupees = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

// Simple placeholder EMI estimate (flat-rate approximation) — swap for the
// real lending-partner calculation once the backend endpoint is available.
const estimateMonthlyEmi = (amount: number, months: number) => {
  const flatInterestRate = 0.12; // 12% p.a., matches Final Loan Details mock
  const totalPayable = amount + amount * flatInterestRate * (months / 12);
  return Math.round(totalPayable / months / 100) * 100;
};

const SelectLoanAmountScreen: React.FC<SelectLoanAmountScreenProps> = ({
  initialAmount = DEFAULT_AMOUNT,
  onBack,
  onConfirm,
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [tenure, setTenure] = useState(12);
  const [trackWidth, setTrackWidth] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pan = useRef(new Animated.Value(0)).current;

  const ratioToAmount = (ratio: number) =>
    MIN_AMOUNT + ratio * (MAX_AMOUNT - MIN_AMOUNT);

  const amountToX = (value: number) => {
    if (trackWidth === 0) {
      return 0;
    }
    const ratio = (value - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT);
    return ratio * trackWidth;
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_evt, gestureState) => {
          if (trackWidth === 0) {
            return;
          }
          const startX = amountToX(amount);
          const rawX = Math.min(
            Math.max(startX + gestureState.dx, 0),
            trackWidth,
          );
          const ratio = rawX / trackWidth;
          const next = ratioToAmount(ratio);
          setAmount(Math.round(next / 1000) * 1000);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trackWidth, amount],
  );

  const thumbX = amountToX(amount);

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
        showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Choose Your Loan Amount</Text>
        <Text style={styles.amountText}>{formatRupees(amount)}</Text>

        <View
          style={styles.sliderTrackWrap}
          onLayout={e => setTrackWidth(e.nativeEvent.layout.width - THUMB_SIZE)}>
          <View style={styles.sliderTrackBg} />
          <View style={[styles.sliderTrackFill, {width: thumbX + THUMB_SIZE / 2}]} />
          <View
            style={[styles.sliderThumb, {left: thumbX}]}
            {...panResponder.panHandlers}
          />
        </View>

        <View style={styles.minMaxRow}>
          <Text style={styles.minMaxText}>Min {formatRupees(MIN_AMOUNT)}</Text>
          <Text style={styles.minMaxText}>Max {formatRupees(MAX_AMOUNT)}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeaderText}>EMI Tenure</Text>
            <Text style={styles.tableHeaderText}>Monthly EMI</Text>
          </View>

          {TENURE_OPTIONS.map(months => {
            const selected = months === tenure;
            return (
              <TouchableOpacity
                key={months}
                style={styles.tableRow}
                activeOpacity={0.7}
                onPress={() => setTenure(months)}>
                <View style={styles.tenureCell}>
                  <View
                    style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                    {selected && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.tenureText}>{months} Months</Text>
                </View>
                <Text style={styles.emiText}>
                  {estimateMonthlyEmi(amount, months).toLocaleString('en-IN')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.85}
          onPress={() => onConfirm?.(amount, tenure)}>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryGreen,
    textAlign: 'center',
    marginTop: 24,
  },
  amountText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 20,
  },
  sliderTrackWrap: {
    height: THUMB_SIZE,
    justifyContent: 'center',
    marginTop: 28,
  },
  sliderTrackBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  sliderTrackFill: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primaryGreen,
  },
  sliderThumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.primaryGreen,
  },
  minMaxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  minMaxText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  table: {
    marginTop: 36,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBorder,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryGreen,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  tenureCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  radioOuterSelected: {
    borderColor: colors.primaryGreen,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryGreen,
  },
  tenureText: {
    fontSize: 17,
    color: colors.textPrimary,
  },
  emiText: {
    fontSize: 17,
    color: colors.textPrimary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
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

export default SelectLoanAmountScreen;