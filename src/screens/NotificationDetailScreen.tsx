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
import {NotificationItem} from '../data/notifications';

interface NotificationDetailScreenProps {
  notification: NotificationItem;
  onBack?: () => void;
}

const NotificationDetailScreen: React.FC<NotificationDetailScreenProps> = ({
  notification,
  onBack,
}) => {
  const introParagraphs = notification.detailIntro.split('\n');

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
        <Text style={styles.timestamp}>{notification.timestamp}</Text>

        <View style={styles.card}>
          <Text style={styles.title}>{notification.title}</Text>

          {introParagraphs.map((paragraph, index) => (
            <Text style={styles.paragraph} key={index}>
              {paragraph}
            </Text>
          ))}

          {notification.loanDetails.length > 0 && (
            <>
              <Text style={styles.sectionHeading}>Loan Details</Text>
              {notification.loanDetails.map(detail => (
                <View style={styles.bulletRow} key={detail.label}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    {detail.label}: {detail.value}
                  </Text>
                </View>
              ))}
            </>
          )}

          {!!notification.whatsNext && (
            <>
              <Text style={styles.sectionHeading}>What's Next?</Text>
              <Text style={styles.paragraph}>{notification.whatsNext}</Text>
            </>
          )}

          {!!notification.needAssistance && (
            <>
              <Text style={styles.sectionHeading}>Need Assistance?</Text>
              <Text style={styles.paragraph}>{notification.needAssistance}</Text>
            </>
          )}
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
    fontSize: 20,
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
  timestamp: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    paddingLeft: 8,
    marginBottom: 2,
  },
  bullet: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});

export default NotificationDetailScreen;