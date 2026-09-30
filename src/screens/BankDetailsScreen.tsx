import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';

export interface BankStatementFile {
  name: string;
  sizeBytes: number;
  uri: string;
  /** MIME type of the picked file, e.g. image/jpeg */
  type?: string;
}

// Set to true if a bank statement must be uploaded before continuing.
const REQUIRE_STATEMENT = false;

export interface BankDetailsFormData {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  statement: BankStatementFile | null;
}

interface BankDetailsScreenProps {
  initialData?: BankDetailsFormData;
  onBack?: () => void;
  onContinue?: (data: BankDetailsFormData) => void | Promise<void>;
  onOpenPrivacyPolicy?: () => void;
  onOpenTerms?: () => void;
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${Math.round(bytes / (1024 * 1024))} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const BankDetailsScreen: React.FC<BankDetailsScreenProps> = ({
  initialData,
  onBack,
  onContinue,
  onOpenPrivacyPolicy,
  onOpenTerms,
}) => {
  const [bankName, setBankName] = useState(initialData?.bankName ?? '');
  const [holderName, setHolderName] = useState(
    initialData?.accountHolderName ?? '',
  );
  const [accountNumber, setAccountNumber] = useState(
    initialData?.accountNumber ?? '',
  );
  const [ifsc, setIfsc] = useState(initialData?.ifscCode ?? '');
  const [statement, setStatement] = useState<BankStatementFile | null>(
    initialData?.statement ?? null,
  );
  const [agreed, setAgreed] = useState(true);
  const [saving, setSaving] = useState(false);

  const ifscValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

  // Everything that is still stopping the user from continuing.
  const problems: string[] = [];
  if (!bankName.trim()) problems.push('Enter the bank name');
  if (!holderName.trim()) problems.push('Enter the account holder name');
  if (accountNumber.length < 9) {
    problems.push('Account number must be at least 9 digits');
  }
  if (!ifscValid) {
    problems.push(
      'IFSC must be 11 characters: 4 letters, then 0, then 6 letters/digits (e.g. SBIN0001234)',
    );
  }
  if (REQUIRE_STATEMENT && !statement) {
    problems.push('Upload your bank statement');
  }
  if (!agreed) problems.push('Accept the Privacy Policy and Terms');

  const canContinue = problems.length === 0;

  // NOTE: react-native-image-picker only picks photos/videos. To pick real
  // PDFs, swap this for a document picker (e.g. @react-native-documents/picker)
  // and fill the same {name, sizeBytes, uri} shape.
  const handleUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });
      if (result.didCancel) {
        return;
      }
      if (result.errorCode) {
        Alert.alert(
          'Upload',
          result.errorMessage || 'Could not open the gallery.',
        );
        return;
      }
      const asset = result.assets?.[0];
      if (asset?.uri) {
        // The server only accepts .jpg / .png / .pdf names, so make sure the
        // name always has an extension.
        const ext = asset.type === 'image/png' ? 'png' : 'jpg';
        const name =
          asset.fileName && /\.(jpe?g|png|pdf)$/i.test(asset.fileName)
            ? asset.fileName
            : `bank_statement_${Date.now()}.${ext}`;
        setStatement({
          name,
          sizeBytes: asset.fileSize ?? 0,
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
        });
      }
    } catch (e: any) {
      Alert.alert('Upload', e?.message || 'Could not pick the file.');
    }
  };

  const handleContinue = async () => {
    if (saving) {
      return;
    }
    // The button always responds: if something is missing, say what.
    if (!canContinue) {
      Alert.alert('Almost there', problems.map(p => `• ${p}`).join('\n'));
      return;
    }
    setSaving(true);
    try {
      await onContinue?.({
        bankName: bankName.trim(),
        accountHolderName: holderName.trim(),
        accountNumber,
        ifscCode: ifsc,
        statement,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Ionicons name="arrow-back" size={22} color={colors.primaryGreen} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Your Bank Details</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Bank Name</Text>
          <TextInput
            style={styles.input}
            value={bankName}
            onChangeText={setBankName}
            placeholder="Enter Bank Name"
            placeholderTextColor={colors.dotInactive}
          />

          <Text style={styles.label}>Account Holder Name</Text>
          <TextInput
            style={styles.input}
            value={holderName}
            onChangeText={setHolderName}
            placeholder="Enter Account Holder Name"
            placeholderTextColor={colors.dotInactive}
          />

          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={styles.input}
            value={accountNumber}
            onChangeText={t => setAccountNumber(t.replace(/[^0-9]/g, ''))}
            placeholder="Enter Account Number"
            placeholderTextColor={colors.dotInactive}
            keyboardType="number-pad"
            maxLength={18}
          />

          <Text style={styles.label}>IFSC Code</Text>
          <TextInput
            style={styles.input}
            value={ifsc}
            onChangeText={t =>
              setIfsc(t.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())
            }
            placeholder="Enter IFSC Code"
            placeholderTextColor={colors.dotInactive}
            autoCapitalize="characters"
            maxLength={11}
          />
          {ifsc.length > 0 && !ifscValid && (
            <Text style={styles.hintText}>
              {ifsc.length < 11
                ? `IFSC needs 11 characters (${ifsc.length}/11)`
                : 'Invalid IFSC: the 5th character must be 0, e.g. SBIN0001234'}
            </Text>
          )}

          <View style={styles.uploadRow}>
            <View style={styles.uploadTextWrap}>
              <Text style={styles.label}>Upload Bank Statement (Last 3 Months)
                {REQUIRE_STATEMENT ? '' : ' - Optional'}
              </Text>
              <Text
                style={[styles.chooseFile, statement && styles.chooseFileFilled]}
                numberOfLines={1}>
                {statement ? statement.name : 'Choose File'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.uploadButton}
              activeOpacity={0.8}
              onPress={handleUpload}>
              <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.uploadUnderline} />

          {statement && (
            <View style={styles.fileCard}>
              <MaterialCommunityIcons
                name="adobe-acrobat"
                size={40}
                color={colors.textPrimary}
              />
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {statement.name}
                </Text>
                <View style={styles.fileMetaRow}>
                  <Text style={styles.fileMeta}>
                    {formatSize(statement.sizeBytes)}
                  </Text>
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={colors.primaryGreen}
                    style={styles.completeIcon}
                  />
                  <Text style={styles.fileMeta}>Complete</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setStatement(null)}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Ionicons name="close-circle" size={24} color={colors.danger} />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.termsRow}>
            <TouchableOpacity
              style={[styles.checkbox, agreed && styles.checkboxChecked]}
              onPress={() => setAgreed(prev => !prev)}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              {agreed && (
                <Ionicons name="checkmark" size={13} color={colors.white} />
              )}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              By continuing, I agree{' '}
              <Text style={styles.link} onPress={onOpenPrivacyPolicy}>
                Privacy Policy
              </Text>{' '}
              and{' '}
              <Text style={styles.link} onPress={onOpenTerms}>
                Terms & Conditions
              </Text>{' '}
              and receive communication via SMS, E-mail.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              !canContinue && styles.continueButtonDisabled,
            ]}
            activeOpacity={0.85}
            disabled={saving}
            onPress={handleContinue}>
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.white},
  hintText: {fontSize: 12, color: colors.danger, marginTop: 4},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {width: 32},
  headerTitle: {fontSize: 18, fontWeight: '700', color: colors.textPrimary},
  scrollContent: {paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24},
  // Figma: Inter Medium, 14px, #757575
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
    letterSpacing: 0,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.tabInactive,
    paddingHorizontal: 8,
    paddingTop: 0,
    paddingBottom: 10,
    marginBottom: 24,
  },
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  uploadTextWrap: {flex: 1, marginRight: 12},
  chooseFile: {
    fontSize: 16,
    color: colors.dotInactive,
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  chooseFileFilled: {color: colors.textPrimary},
  uploadButton: {
    backgroundColor: '#EBEBEB',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 9,
    marginBottom: 8,
  },
  uploadButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  uploadUnderline: {
    height: 1,
    backgroundColor: colors.tabInactive,
    marginBottom: 20,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  fileInfo: {flex: 1, marginLeft: 12, marginRight: 8},
  fileName: {fontSize: 16, fontWeight: '600', color: colors.textPrimary},
  fileMetaRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  fileMeta: {fontSize: 12, color: colors.textSecondary},
  completeIcon: {marginLeft: 12, marginRight: 4},
  footer: {paddingHorizontal: 16, paddingBottom: 16},
  termsRow: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20},
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {backgroundColor: colors.primaryGreen},
  termsText: {flex: 1, fontSize: 13, lineHeight: 18, color: colors.textPrimary},
  link: {color: colors.primaryGreen},
  continueButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {opacity: 0.5},
  continueButtonText: {color: colors.white, fontSize: 18, fontWeight: '700'},
});

export default BankDetailsScreen;