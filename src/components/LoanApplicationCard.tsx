import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';

export type LoanStatus = 'approved' | 'pending' | 'completed';

interface LoanApplicationCardProps {
  title: string;
  subtitle: string;
  amount: string;
  status: LoanStatus;
  ctaLabel: string;
  ctaDisabled?: boolean;
  onPressCta?: () => void;
}

const LoanApplicationCard: React.FC<LoanApplicationCardProps> = ({
  title,
  subtitle,
  amount,
  status,
  ctaLabel,
  ctaDisabled,
  onPressCta,
}) => {
  const isApproved = status === 'approved';
  const isCompleted = status === 'completed';
  const statusLabel = isCompleted ? 'Completed' : isApproved ? 'Approved' : 'Pending';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons
            name="piggy-bank-outline"
            size={24}
            color={isCompleted ? colors.textSecondary : colors.primaryGreen}
          />
        </View>
        <View style={styles.titleColumn}>
          <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
            {title}
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            isCompleted
              ? styles.statusBadgeCompleted
              : isApproved
              ? styles.statusBadgeApproved
              : styles.statusBadgePending,
          ]}>
          <Text
            style={[
              styles.statusText,
              isCompleted
                ? styles.statusTextCompleted
                : isApproved
                ? styles.statusTextApproved
                : styles.statusTextPending,
            ]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <Text style={styles.amount}>{amount}</Text>

      <TouchableOpacity
        style={[styles.ctaButton, ctaDisabled && styles.ctaButtonDisabled]}
        activeOpacity={ctaDisabled ? 1 : 0.85}
        disabled={ctaDisabled}
        onPress={onPressCta}>
        <Text style={styles.ctaText}>{ctaLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  iconWrap: {
    marginRight: 10,
    marginTop: 2,
  },
  titleColumn: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primaryGreen,
  },
  titleCompleted: {
    color: colors.textSecondary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  statusBadgeApproved: {
    backgroundColor: '#CDEBD3',
  },
  statusBadgePending: {
    backgroundColor: '#F8D6D6',
  },
  statusBadgeCompleted: {
    backgroundColor: '#E3E3E3',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusTextApproved: {
    color: colors.primaryGreen,
  },
  statusTextPending: {
    color: '#D9534F',
  },
  statusTextCompleted: {
    color: colors.textSecondary,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  ctaButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonDisabled: {
    backgroundColor: '#6E6E6E',
  },
  ctaText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});

export default LoanApplicationCard;