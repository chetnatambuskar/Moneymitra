import React from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../theme/colors';

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
}

const PaginationDots: React.FC<PaginationDotsProps> = ({
  total,
  activeIndex,
}) => {
  return (
    <View style={styles.row}>
      {Array.from({length: total}).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === activeIndex && styles.dotActive]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.dotInactive,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.primaryGreen,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default PaginationDots;
