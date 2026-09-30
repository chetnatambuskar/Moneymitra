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

interface UploadDocumentForVerificationScreenProps {
  items?: DocumentVerificationItem[];
  /** ids of items already captured in this session */
  uploadedIds?: string[];
  onBack?: () => void;
  onUploadItem?: (item: DocumentVerificationItem) => void;
  onContinue?: () => void;
}

const UploadDocumentForVerificationScreen: React.FC<
  UploadDocumentForVerificationScreenProps
> = ({
  items = DOCUMENT_VERIFICATION_ITEMS,
  uploadedIds = [],
  onBack,
  onUploadItem,
  onContinue,
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Ionicons name="arrow-back" size={22} color={colors.primaryGreen} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {items.map((item, i) => {
          const uploaded = uploadedIds.includes(item.id);
          return (
            <View
              key={item.id}
              style={[
                styles.row,
                i === items.length - 1 && styles.rowLast,
              ]}>
              <MaterialCommunityIcons
                name={item.icon}
                size={26}
                color={colors.primaryGreen}
                style={styles.rowIcon}
              />
              <View style={styles.textColumn}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  uploaded && styles.uploadButtonDone,
                ]}
                activeOpacity={0.8}
                onPress={() => onUploadItem?.(item)}>
                {uploaded ? (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={colors.primaryGreen}
                  />
                ) : (
                  <Text style={styles.uploadButtonText}>Upload</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.continueButton}
        activeOpacity={0.85}
        onPress={onContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.white},
  flex: {flex: 1},
  header: {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20},
  backButton: {width: 32},
  scrollContent: {paddingHorizontal: 16},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {borderBottomWidth: 1},
  rowIcon: {width: 32},
  textColumn: {flex: 1, marginLeft: 8},
  title: {fontSize: 17, fontWeight: '700', color: colors.textPrimary},
  subtitle: {fontSize: 14, color: colors.textSecondary, marginTop: 2},
  uploadButton: {
    backgroundColor: '#EBEBEB',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  uploadButtonDone: {backgroundColor: '#D1E9D5'},
  uploadButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  continueButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {color: colors.white, fontSize: 18, fontWeight: '700'},
});

export default UploadDocumentForVerificationScreen;