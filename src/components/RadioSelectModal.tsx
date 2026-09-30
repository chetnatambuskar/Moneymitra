import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../theme/colors';

interface RadioSelectModalProps {
  visible: boolean;
  title: string;
  options: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

/**
 * Bottom-sheet radio picker used for "Select Your Gender", "Select Your
 * Marital Status" and "Select Employment Type" fields across the loan
 * application form. Tapping an option selects it and closes the sheet.
 */
const RadioSelectModal: React.FC<RadioSelectModalProps> = ({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.grabber} />
          <Text style={styles.title}>{title}</Text>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {options.map(option => {
            const selected = option === selectedValue;
            return (
              <TouchableOpacity
                key={option}
                style={styles.optionRow}
                activeOpacity={0.7}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}>
                <View
                  style={[
                    styles.radioOuter,
                    selected && styles.radioOuterSelected,
                  ]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
  list: {
    maxHeight: 360,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  optionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
});

export default RadioSelectModal;