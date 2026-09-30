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
import SettingsRow from '../components/SettingsRow';
import BottomTabBar, {TabKey} from '../components/BottomTabBar';
import {CURRENT_USER} from '../data/profile';

interface SettingsScreenProps {
  onOpenProfile?: () => void;
  onOpenDocumentVerified?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTermsConditions?: () => void;
  onOpenHelpSupport?: () => void;
  onLogout?: () => void;
  onTabPress?: (tab: TabKey) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onOpenProfile,
  onOpenDocumentVerified,
  onOpenPrivacyPolicy,
  onOpenTermsConditions,
  onOpenHelpSupport,
  onLogout,
  onTabPress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          {CURRENT_USER.avatarUri ? (
            <Image
              source={{uri: CURRENT_USER.avatarUri}}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <Text style={styles.userName}>{CURRENT_USER.fullName}</Text>
          <Text style={styles.completion}>
            {CURRENT_USER.profileCompletionPercent}% Profile Completed
          </Text>
        </View>

        <SettingsRow
          icon="person-outline"
          title="Profile"
          subtitle="Manage your personal information"
          onPress={onOpenProfile}
        />
        <SettingsRow
          iconSet="material"
          icon="check-decagram"
          title="Document Verified"
          subtitle="Track your verification status"
          onPress={onOpenDocumentVerified}
        />
        <SettingsRow
          iconSet="material"
          icon="shield-check"
          title="Privacy Policy"
          subtitle="Your privacy and data protection details"
          onPress={onOpenPrivacyPolicy}
        />
        <SettingsRow
          icon="document-text-outline"
          title="Terms & Conditions"
          subtitle="View service terms and agreements"
          onPress={onOpenTermsConditions}
        />
        <SettingsRow
          icon="help-buoy-outline"
          title="Help & Support"
          subtitle="Get help and contact support"
          onPress={onOpenHelpSupport}
        />

        <TouchableOpacity
          style={styles.logoutRow}
          activeOpacity={0.7}
          onPress={onLogout}>
          <Ionicons
            name="log-out-outline"
            size={22}
            color={colors.danger}
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar activeTab="settings" onTabPress={onTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    flexGrow: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryGreen,
    marginBottom: 4,
  },
  completion: {
    fontSize: 14,
    color: colors.primaryGreen,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.danger,
  },
});

export default SettingsScreen;
