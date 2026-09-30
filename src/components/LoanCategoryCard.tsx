import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';

interface LoanCategoryCardProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

const LoanCategoryCard: React.FC<LoanCategoryCardProps> = ({
  icon,
  title,
  subtitle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}>
      <MaterialCommunityIcons
        name={icon}
        size={26}
        color={colors.primaryGreen}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default LoanCategoryCard;
