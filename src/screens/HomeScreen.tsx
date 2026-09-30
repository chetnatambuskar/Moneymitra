import React from 'react';
import {
  Image,
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
import LoanCategoryCard from '../components/LoanCategoryCard';
import BottomTabBar, {TabKey} from '../components/BottomTabBar';

interface LoanCategory {
  icon: string;
  title: string;
  subtitle: string;
}

const LOAN_CATEGORIES: LoanCategory[] = [
  {icon: 'piggy-bank-outline', title: 'Personal Loan', subtitle: 'Get Up to 10L'},
  {icon: 'clock-fast', title: 'Instant Loan', subtitle: 'Get Up to 10L'},
  {icon: 'motorbike', title: 'Bike Loan', subtitle: 'Get Up to 5L'},
  {icon: 'car-outline', title: 'Car Loan', subtitle: 'Get Up to 35L'},
  {icon: 'briefcase-outline', title: 'Business Loan', subtitle: 'Get Up to 75L'},
  {icon: 'domain', title: 'Home Loan', subtitle: 'Get Up to 1 Cr & Above'},
];

interface HomeScreenProps {
  userName?: string;
  avatarUri?: string;
  onGetInstantLoan?: () => void;
  onSelectCategory?: (title: string) => void;
  onPressNotifications?: () => void;
  /** Tapping the profile circle in the header opens the Settings section. */
  onPressProfile?: () => void;
  onTabPress?: (tab: TabKey) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  avatarUri,
  onGetInstantLoan,
  onSelectCategory,
  onPressNotifications,
  onPressProfile,
  onTabPress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onPressProfile}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              {avatarUri ? (
                <Image source={{uri: avatarUri}} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder} />
              )}
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.welcomeBack}>Welcome Back</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onPressNotifications}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Ionicons name="notifications" size={24} color={colors.primaryGreen} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroCircleLarge} />
          <View style={styles.heroCircleSmall} />
          <Text style={styles.heroTitle}>Instant Loan{'\n'}Upto 10 Lakh</Text>
          <Text style={styles.heroSubtitle}>
            Apply in minutes, track your progress, and receive updates every
            step of the way.
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            activeOpacity={0.85}
            onPress={onGetInstantLoan}>
            <Text style={styles.heroButtonText}>Get Instant Loan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {LOAN_CATEGORIES.map(category => (
            <LoanCategoryCard
              key={category.title}
              icon={category.icon}
              title={category.title}
              subtitle={category.subtitle}
              onPress={() => onSelectCategory?.(category.title)}
            />
          ))}
        </View>
      </ScrollView>

      <BottomTabBar activeTab="home" onTabPress={onTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    backgroundColor: colors.border,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryGreen,
  },
  welcomeBack: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  heroCard: {
    backgroundColor: colors.navyDark,
    borderRadius: 20,
    padding: 20,
    paddingTop: 24,
    marginBottom: 20,
    overflow: 'hidden',
  },
  heroCircleLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.navyLight,
    opacity: 0.5,
    top: -60,
    right: -60,
  },
  heroCircleSmall: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.navyLight,
    opacity: 0.4,
    top: 40,
    right: -20,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.white,
    marginBottom: 24,
  },
  heroButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;