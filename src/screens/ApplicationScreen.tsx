import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
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
import {loanApi, LoanApplicationRecord} from '../services/api';
import {ApplicationCardModel, buildApplicationCard} from '../utils/loanFlow';

type ApplicationTab = 'active' | 'closed';

interface ApplicationScreenProps {
  onBack?: () => void;
  /**
   * Called when the card button is pressed.
   * `route` is the screen the user should resume at (already worked out from
   * the loan's completed steps), `loan` is the full record incl. steps.
   */
  onPressCta?: (loan: LoanApplicationRecord, route: string | null) => void;
  onTabPress?: (tab: TabKey) => void;
}

const ApplicationScreen: React.FC<ApplicationScreenProps> = ({
  onBack,
  onPressCta,
  onTabPress,
}) => {
  const [activeTab, setActiveTab] = useState<ApplicationTab>('active');
  const [loans, setLoans] = useState<LoanApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      setLoans(await loanApi.listLoans());
    } catch (e: any) {
      setError(e?.message || 'Could not load your applications.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cards: ApplicationCardModel[] = useMemo(
    () =>
      loans
        .map(buildApplicationCard)
        .filter(c => (activeTab === 'closed' ? c.isClosed : !c.isClosed)),
    [loans, activeTab],
  );

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
        {(['active', 'closed'] as ApplicationTab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab && styles.tabLabelActive,
              ]}>
              {tab === 'active' ? 'Active Loan' : 'Closed Loan'}
            </Text>
            <View
              style={[
                styles.tabUnderline,
                activeTab === tab && styles.tabUnderlineActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />
        }>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator color={colors.primaryGreen} />
          </View>
        ) : error ? (
          <View style={styles.centerBox}>
            <Text style={styles.emptyText}>{error}</Text>
            <Text style={styles.retryText} onPress={() => load()}>
              Try again
            </Text>
          </View>
        ) : cards.length === 0 ? (
          <Text style={styles.emptyText}>
            {activeTab === 'active'
              ? 'No active loans yet.'
              : 'No closed loans yet.'}
          </Text>
        ) : (
          cards.map(card => (
            <LoanApplicationCard
              key={card.loan.id}
              title={card.title}
              subtitle={card.subtitle}
              amount={card.amount}
              status={card.status}
              ctaLabel={card.ctaLabel}
              ctaDisabled={card.ctaDisabled}
              onPressCta={() => onPressCta?.(card.loan, card.route)}
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
  centerBox: {
    alignItems: 'center',
    marginTop: 40,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryGreen,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default ApplicationScreen;