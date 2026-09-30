import React, {useState} from 'react';
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
import LoanApplicationCard from '../components/LoanApplicationCard';
import BottomTabBar, {TabKey} from '../components/BottomTabBar';
import {
  ACTIVE_LOAN_APPLICATIONS,
  CLOSED_LOAN_APPLICATIONS,
  LoanApplication,
} from '../data/loanApplications';

type ApplicationTab = 'active' | 'closed';

interface ApplicationScreenProps {
  onBack?: () => void;
  onPressCta?: (application: LoanApplication) => void;
  onTabPress?: (tab: TabKey) => void;
}

const ApplicationScreen: React.FC<ApplicationScreenProps> = ({
  onBack,
  onPressCta,
  onTabPress,
}) => {
  const [activeTab, setActiveTab] = useState<ApplicationTab>('active');
  const applications =
    activeTab === 'active' ? ACTIVE_LOAN_APPLICATIONS : CLOSED_LOAN_APPLICATIONS;

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
        <Text style={styles.headerTitle}>Application</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('active')}>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'active' && styles.tabLabelActive,
            ]}>
            Active Loan
          </Text>
          <View
            style={[
              styles.tabUnderline,
              activeTab === 'active' && styles.tabUnderlineActive,
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('closed')}>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'closed' && styles.tabLabelActive,
            ]}>
            Closed Loan
          </Text>
          <View
            style={[
              styles.tabUnderline,
              activeTab === 'closed' && styles.tabUnderlineActive,
            ]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {applications.length === 0 ? (
          <Text style={styles.emptyText}>
            {activeTab === 'active'
              ? 'No active loans yet.'
              : 'No closed loans yet.'}
          </Text>
        ) : (
          applications.map(application => (
            <LoanApplicationCard
              key={application.id}
              title={application.title}
              subtitle={application.subtitle}
              amount={application.amount}
              status={application.status}
              ctaLabel={application.ctaLabel}
              ctaDisabled={application.ctaDisabled}
              onPressCta={() => onPressCta?.(application)}
            />
          ))
        )}
      </ScrollView>

      <BottomTabBar activeTab="application" onTabPress={onTabPress} />
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 32,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  tabLabelActive: {
    color: colors.primaryGreen,
  },
  tabUnderline: {
    height: 2,
    width: '100%',
    backgroundColor: 'transparent',
  },
  tabUnderlineActive: {
    backgroundColor: colors.primaryGreen,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default ApplicationScreen;
