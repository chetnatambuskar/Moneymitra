import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
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
import {loanApi, LoanApplicationRecord} from '../services/api';
import {STEP_ROUTES, getNextStep} from '../utils/loanFlow';

interface CompleteProcessScreenProps {
  /** The loan whose checklist should be shown. */
  loanId: number;
  onBack?: () => void;
  /** Called with the step number and the screen that step opens. */
  onSelectStep?: (stepNumber: number, route: string, loan: LoanApplicationRecord) => void;
}

const CompleteProcessScreen: React.FC<CompleteProcessScreenProps> = ({
  loanId,
  onBack,
  onSelectStep,
}) => {
  const [loan, setLoan] = useState<LoanApplicationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLoan(await loanApi.getLoan(loanId));
    } catch (e: any) {
      setError(e?.message || 'Could not load this application.');
    } finally {
      setLoading(false);
    }
  }, [loanId]);

  useEffect(() => {
    load();
  }, [load]);

  const steps = loan?.steps ?? [];
  const nextStepNumber = getNextStep(steps)?.step_number ?? Infinity;

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

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color={colors.primaryGreen} />
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={load}>
            Try again
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {steps.map(step => {
            // Finished steps can be reopened, the next pending step is the
            // current one, and anything after it stays locked.
            const locked = step.step_number > nextStepNumber;
            const current = step.step_number === nextStepNumber;
            return (
              <TouchableOpacity
                key={step.step_number}
                style={[
                  styles.row,
                  current && styles.stepCurrent,
                  locked && styles.stepLocked,
                ]}
                activeOpacity={0.7}
                disabled={locked}
                onPress={() =>
                  loan &&
                  STEP_ROUTES[step.step_number] &&
                  onSelectStep?.(step.step_number, STEP_ROUTES[step.step_number], loan)
                }>
                <View style={styles.stepNumberCircle}>
                  <Text style={styles.stepNumberText}>{step.step_number}</Text>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
                {step.completed ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={26}
                    color={colors.primaryGreen}
                  />
                ) : locked ? (
                  <Ionicons name="lock-closed-outline" size={22} color={colors.tabInactive} />
                ) : (
                  <View style={styles.stepIncompleteCircle} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
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
  stepLocked: {
    opacity: 0.45,
  },
  stepCurrent: {
    borderColor: colors.primaryGreen,
  },
  centerBox: {
    alignItems: 'center',
    marginTop: 40,
  },
  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryGreen,
    marginTop: 10,
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