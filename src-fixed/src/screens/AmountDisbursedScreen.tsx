import React from 'react';
import {
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';
import {DISBURSED_AMOUNT} from '../data/loanAgreement';

interface Props {
  amount?: string;
  /** URL of the signed agreement PDF. Opened in the system viewer/browser. */
  agreementUrl?: string;
  onBackToHome?: () => void;
}

const AmountDisbursedScreen: React.FC<Props> = ({
  amount = DISBURSED_AMOUNT,
  agreementUrl,
  onBackToHome,
}) => (
  <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
    <StatusBar barStyle="dark-content" />
    <View style={styles.center}>
      <MaterialCommunityIcons
        name="check-decagram"
        size={96}
        color={colors.primaryGreen}
      />
      <Text style={styles.title}>Amount Will Be{'\n'}Disbursed Soon!</Text>
      <Text style={styles.amount}>{amount}</Text>
      <Text style={styles.subtitle}>
        The disbursed amount will be{'\n'}credited to your account shortly.
      </Text>
    </View>

    <TouchableOpacity
      style={styles.download}
      activeOpacity={0.8}
      onPress={() => agreementUrl && Linking.openURL(agreementUrl)}>
      <Text style={styles.downloadText}>Download Agreement</Text>
      <Ionicons name="download-outline" size={22} color={colors.primaryGreen} />
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.85}
      onPress={onBackToHome}>
      <Text style={styles.buttonText}>Back To Home</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.white},
  center: {flex: 1, alignItems: 'center', paddingTop: 80, paddingHorizontal: 24},
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginTop: 40,
  },
  amount: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.primaryGreen,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  download: {
    marginHorizontal: 32,
    marginBottom: 40,
    backgroundColor: '#D1E9D5',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  downloadText: {fontSize: 18, color: '#000000'},
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

export default AmountDisbursedScreen;