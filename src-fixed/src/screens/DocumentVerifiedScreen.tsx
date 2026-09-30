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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';
import {
  DOCUMENT_VERIFICATION_ITEMS,
  DocumentVerificationItem,
} from '../data/documentVerification';

interface DocumentVerifiedScreenProps {
  onBack?: () => void;
  onSelectItem?: (item: DocumentVerificationItem) => void;
}

const DocumentVerifiedScreen: React.FC<DocumentVerifiedScreenProps> = ({
  onBack,
  onSelectItem,
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
        <Text style={styles.headerTitle}>Document Verified</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {DOCUMENT_VERIFICATION_ITEMS.map(item => (
          <TouchableOpacity
            style={styles.row}
            key={item.id}
            activeOpacity={0.7}
            onPress={() => onSelectItem?.(item)}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name={item.icon}
                size={20}
                color={colors.white}
              />
            </View>
            <View style={styles.textColumn}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.verified ? 'Verified' : 'Pending'}
              </Text>
            </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.statusApprovedBg,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryGreen,
  },
});

export default DocumentVerifiedScreen;