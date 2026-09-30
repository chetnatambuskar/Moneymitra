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
import {
  PRIVACY_POLICY_EFFECTIVE_DATE,
  PRIVACY_POLICY_PARAGRAPHS,
} from '../data/legalText';

interface PrivacyPolicyScreenProps {
  onBack?: () => void;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({
  onBack,
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.effectiveDate}>
          Effective Date: {PRIVACY_POLICY_EFFECTIVE_DATE}
        </Text>

        <View style={styles.card}>
          {PRIVACY_POLICY_PARAGRAPHS.map((paragraph, index) => (
            <Text style={styles.paragraph} key={index}>
              {paragraph}
            </Text>
          ))}
        </View>
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
    paddingBottom: 32,
  },
  effectiveDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.cardBackgroundGray,
    borderRadius: 14,
    padding: 16,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textPrimary,
    marginBottom: 14,
  },
});

export default PrivacyPolicyScreen;
