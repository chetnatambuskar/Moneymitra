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
import {NotificationItem, NOTIFICATIONS} from '../data/notifications';

interface NotificationsScreenProps {
  onBack?: () => void;
  onSelectNotification?: (notification: NotificationItem) => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onBack,
  onSelectNotification,
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map(notification => (
          <TouchableOpacity
            key={notification.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => onSelectNotification?.(notification)}>
            <View style={styles.cardTextColumn}>
              <Text style={styles.cardTitle}>{notification.title}</Text>
              <Text style={styles.cardSummary}>{notification.summary}</Text>
              <Text style={styles.cardTimestamp}>
                {notification.timestamp}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.textPrimary} />
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
    fontSize: 20,
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  cardTextColumn: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  cardSummary: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  cardTimestamp: {
    fontSize: 13,
    color: colors.textPrimary,
  },
});

export default NotificationsScreen;
