import React, {useCallback, useEffect, useState} from 'react';
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
import {NotificationItem, toNotificationItem} from '../data/notifications';
import {notificationApi} from '../services/api';

interface NotificationsScreenProps {
  items?: NotificationItem[];
  onBack?: () => void;
  onSelectNotification?: (notification: NotificationItem) => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  items: itemsProp,
  onBack,
  onSelectNotification,
}) => {
  // Notifications are loaded from the server. They only exist once a real
  // event (application submitted, loan disbursed, ...) has happened.
  const [loaded, setLoaded] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(!itemsProp);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (pull = false) => {
    pull ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const rows = await notificationApi.listNotifications();
      setLoaded(rows.map(toNotificationItem));
    } catch (e: any) {
      setError(e?.message || 'Could not load notifications.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!itemsProp) {
      load();
    }
  }, [itemsProp, load]);

  const items = itemsProp ?? loaded;

  const open = (n: NotificationItem) => {
    if (!n.isRead) {
      setLoaded(prev => prev.map(p => (p.id === n.id ? {...p, isRead: true} : p)));
      notificationApi.markRead(Number(n.id)).catch(() => {});
    }
    onSelectNotification?.({...n, isRead: true});
  };

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
      ) : (
      <ScrollView
        contentContainerStyle={[styles.scrollContent, items.length === 0 && styles.emptyContent]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />
        }>
        {items.length === 0 && (
          <View style={styles.centerBox}>
            <Ionicons name="notifications-off-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptyHint}>We'll let you know when something happens with your loan.</Text>
          </View>
        )}
        {items.map(notification => (
          <TouchableOpacity
            key={notification.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => open(notification)}>
            <View style={styles.cardTextColumn}>
              <View style={styles.titleRow}>
                {!notification.isRead && <View style={styles.unreadDot} />}
                <Text style={styles.cardTitle}>{notification.title}</Text>
              </View>
              <Text style={styles.cardSummary}>{notification.summary}</Text>
              <Text style={styles.cardTimestamp}>
                {notification.timestamp}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        ))}
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
  titleRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 6},
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryGreen,
    marginRight: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  centerBox: {alignItems: 'center', justifyContent: 'center', padding: 24, flex: 1},
  emptyContent: {flexGrow: 1},
  emptyText: {fontSize: 16, color: colors.textPrimary, marginTop: 12, textAlign: 'center'},
  emptyHint: {fontSize: 13, color: colors.textSecondary, marginTop: 6, textAlign: 'center'},
  retryText: {fontSize: 14, fontWeight: '700', color: colors.primaryGreen, marginTop: 10},
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