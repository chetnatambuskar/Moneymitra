import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';

interface SettingsRowProps {
  iconSet?: 'ionicons' | 'material';
  icon: string;
  title: string;
  subtitle: string;
  danger?: boolean;
  showChevron?: boolean;
  onPress?: () => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  iconSet = 'ionicons',
  icon,
  title,
  subtitle,
  danger,
  showChevron = true,
  onPress,
}) => {
  const iconColor = danger ? colors.danger : colors.primaryGreen;

  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.iconWrap}>
        {iconSet === 'material' ? (
          <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
        ) : (
          <Ionicons name={icon} size={22} color={iconColor} />
        )}
      </View>
      <View style={styles.textColumn}>
        <Text style={[styles.title, danger && styles.titleDanger]}>
          {title}
        </Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  titleDanger: {
    color: colors.danger,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default SettingsRow;
