import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';
import {AgreementFormData, loanApi} from '../services/api';
import LoanApplicationFormDocument, {
  DOCUMENT_PAGE_COUNT,
} from '../components/LoanApplicationFormDocument';

interface Props {
  /** The loan whose application form should be shown. */
  loanId: number;
  onBack?: () => void;
  onGetOtp?: () => void;
}

const AgreementPreviewScreen: React.FC<Props> = ({loanId, onBack, onGetOtp}) => {
  const [index, setIndex] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [data, setData] = useState<AgreementFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const total = DOCUMENT_PAGE_COUNT;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await loanApi.getAgreement(loanId));
    } catch (e: any) {
      setError(e?.message || 'Could not load your application form.');
    } finally {
      setLoading(false);
    }
  }, [loanId]);

  useEffect(() => {
    load();
  }, [load]);

  const canContinue = agreed && !!data;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Ionicons name="arrow-back" size={22} color={colors.primaryGreen} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.viewer}>
          <View style={styles.page}>
            {loading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator color={colors.primaryGreen} />
              </View>
            ) : error || !data ? (
              <View style={styles.centerBox}>
                <Text style={styles.placeholder}>
                  {error || 'Could not load your application form.'}
                </Text>
                <Text style={styles.retryText} onPress={load}>
                  Try again
                </Text>
              </View>
            ) : (
              <LoanApplicationFormDocument data={data} page={index} />
            )}
          </View>

          <View style={styles.pager}>
            <TouchableOpacity
              disabled={index === 0}
              onPress={() => setIndex(i => i - 1)}
              style={index === 0 && styles.dim}>
              <Ionicons name="arrow-back" size={28} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.pageBadge}>
              <Text style={styles.pageBadgeText}>{index + 1}</Text>
            </View>
            <TouchableOpacity
              disabled={index >= total - 1}
              onPress={() => setIndex(i => i + 1)}
              style={index >= total - 1 && styles.dim}>
              <Ionicons name="arrow-forward" size={28} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.checkRow}>
          <TouchableOpacity
            style={[styles.checkbox, agreed && styles.checkboxChecked]}
            onPress={() => setAgreed(p => !p)}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            {agreed && (
              <Ionicons name="checkmark" size={13} color={colors.white} />
            )}
          </TouchableOpacity>
          <Text style={styles.checkText}>
            I have read and agree to the agreement details provided.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !canContinue && styles.buttonDisabled]}
        activeOpacity={0.85}
        disabled={!canContinue}
        onPress={onGetOtp}>
        <Text style={styles.buttonText}>Get OTP</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.white},
  header: {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, height: 44},
  body: {flex: 1, paddingHorizontal: 16, justifyContent: 'center'},
  viewer: {
    backgroundColor: '#757575',
    borderRadius: 32,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  page: {
    backgroundColor: colors.white,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageImage: {width: '100%', height: '100%'},
  placeholder: {textAlign: 'center', color: colors.textSecondary, fontSize: 14},
  centerBox: {alignItems: 'center', justifyContent: 'center', padding: 24},
  retryText: {fontSize: 14, fontWeight: '700', color: colors.primaryGreen, marginTop: 10},
  pager: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginTop: 22,
  },
  dim: {opacity: 0.35},
  pageBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBadgeText: {color: colors.white, fontSize: 24},
  checkRow: {flexDirection: 'row', alignItems: 'center', marginTop: 16},
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
  // Figma: Inter Regular 12px, #000000
  checkText: {flex: 1, fontSize: 12, lineHeight: 12, color: '#000000'},
  button: {
    marginHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {opacity: 0.5},
  buttonText: {color: colors.white, fontSize: 18, fontWeight: '700'},
});

export default AgreementPreviewScreen;