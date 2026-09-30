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
import {LOAN_PROCESS_STEPS} from '../data/loanProcessSteps';

interface CompleteProcessScreenProps {
  onBack?: () => void;
  onSelectStep?: (stepId: string) => void;
}

const CompleteProcessScreen: React.FC<CompleteProcessScreenProps> = ({
  onBack,
  onSelectStep,
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
        <Text style={styles.headerTitle}>Complete Your Process</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {LOAN_PROCESS_STEPS.map(step => (
          <TouchableOpacity
            key={step.id}
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => onSelectStep?.(step.id)}>
            <View style={styles.stepNumberCircle}>
              <Text style={styles.stepNumberText}>{step.step}</Text>
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            {step.completed ? (
              <Ionicons
                name="checkmark-circle"
                size={26}
                color={colors.primaryGreen}
              />
            ) : (
              <View style={styles.stepIncompleteCircle} />
            )}
          </TouchableOpacity>
        ))}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  stepNumberCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepIncompleteCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
});

export default CompleteProcessScreen;
