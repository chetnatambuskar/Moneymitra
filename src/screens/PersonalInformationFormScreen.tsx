import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';
import RadioSelectModal from '../components/RadioSelectModal';
import {
  EMPLOYMENT_TYPE_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PersonalInfoFormData,
} from '../data/loanForm';

type ActiveModal =
  | 'gender'
  | 'marital'
  | 'employment'
  | 'day'
  | 'month'
  | 'year'
  | null;

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0'));
// Applicants must be 18+, so years run from (this year - 18) back 62 years.
const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({length: 63}, (_, i) => String(THIS_YEAR - 18 - i));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

interface PersonalInformationFormScreenProps {
  initialData?: PersonalInfoFormData;
  onBack?: () => void;
  onNext?: (data: PersonalInfoFormData) => void;
}

const PersonalInformationFormScreen: React.FC<
  PersonalInformationFormScreenProps
> = ({initialData, onBack, onNext}) => {
  // Everything starts empty for a new user. `initialData` is only filled
  // when the person already saved details (or is coming back to this form).
  const [nameAsPerPan, setNameAsPerPan] = useState(initialData?.nameAsPerPan ?? '');
  const [dobDay, setDobDay] = useState(initialData?.dobDay ?? '');
  const [dobMonth, setDobMonth] = useState(initialData?.dobMonth ?? '');
  const [dobYear, setDobYear] = useState(initialData?.dobYear ?? '');
  const [gender, setGender] = useState(initialData?.gender ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [maritalStatus, setMaritalStatus] = useState(initialData?.maritalStatus ?? '');
  const [loanAmount, setLoanAmount] = useState(initialData?.loanAmount ?? '');
  const [employmentType, setEmploymentType] = useState(initialData?.employmentType ?? '');
  const [panNumber, setPanNumber] = useState(initialData?.panNumber ?? '');

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const isValidDob = () => {
    if (!dobDay || !dobMonth || !dobYear) return false;
    const d = Number(dobDay);
    const m = MONTHS.indexOf(dobMonth);
    const y = Number(dobYear);
    const dt = new Date(y, m, d);
    // Rejects impossible dates such as 31 Feb
    return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
  };

  const handleNext = () => {
    if (!nameAsPerPan.trim()) {
      return Alert.alert('Personal Information', 'Please enter your name.');
    }
    if (!dobDay || !dobMonth || !dobYear) {
      return Alert.alert('Personal Information', 'Please select your date of birth.');
    }
    if (!isValidDob()) {
      return Alert.alert('Personal Information', 'Please select a valid date of birth.');
    }
    if (!gender) {
      return Alert.alert('Personal Information', 'Please select your gender.');
    }
    if (!EMAIL_RE.test(email.trim())) {
      return Alert.alert('Personal Information', 'Please enter a valid email address.');
    }
    if (!maritalStatus) {
      return Alert.alert('Personal Information', 'Please select your marital status.');
    }
    if (!loanAmount.trim()) {
      return Alert.alert('Personal Information', 'Please enter the required loan amount.');
    }
    if (!employmentType) {
      return Alert.alert('Personal Information', 'Please select your employment type.');
    }
    if (!PAN_RE.test(panNumber.trim())) {
      return Alert.alert('Personal Information', 'Please enter a valid PAN number (e.g. ABCDE1234F).');
    }

    onNext?.({
      nameAsPerPan: nameAsPerPan.trim(),
      dobDay,
      dobMonth,
      dobYear,
      gender,
      email: email.trim(),
      maritalStatus,
      loanAmount,
      employmentType,
      panNumber: panNumber.trim(),
      purpose: undefined,
      address: undefined
    });
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
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionHeading}>Personal Information</Text>

        <Text style={styles.label}>Enter Your Name According Pan card</Text>
        <TextInput
          style={styles.input}
          value={nameAsPerPan}
          onChangeText={setNameAsPerPan}
          placeholder="Full name"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Enter Your DOB</Text>
        <View style={styles.dobRow}>
          <TouchableOpacity
            style={styles.dobField}
            activeOpacity={0.7}
            onPress={() => setActiveModal('day')}>
            <Text style={[styles.dobText, !dobDay && styles.placeholderText]}>
              {dobDay || 'DD'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dobField}
            activeOpacity={0.7}
            onPress={() => setActiveModal('month')}>
            <Text style={[styles.dobText, !dobMonth && styles.placeholderText]}>
              {dobMonth || 'Month'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dobField}
            activeOpacity={0.7}
            onPress={() => setActiveModal('year')}>
            <Text style={[styles.dobText, !dobYear && styles.placeholderText]}>
              {dobYear || 'YYYY'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Select Your Gender</Text>
        <TouchableOpacity
          style={styles.dropdownRow}
          activeOpacity={0.7}
          onPress={() => setActiveModal('gender')}>
          <Text style={[styles.dropdownText, !gender && styles.placeholderText]}>
            {gender || 'Select gender'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.label}>Enter Your Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Select Your Marital Status</Text>
        <TouchableOpacity
          style={styles.dropdownRow}
          activeOpacity={0.7}
          onPress={() => setActiveModal('marital')}>
          <Text style={[styles.dropdownText, !maritalStatus && styles.placeholderText]}>
            {maritalStatus || 'Select marital status'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.label}>Required Loan Amount</Text>
        <View style={styles.amountRow}>
          <Text style={styles.rupee}>₹</Text>
          <TextInput
            style={styles.amountInput}
            value={loanAmount}
            onChangeText={setLoanAmount}
            keyboardType="number-pad"
            placeholder="Enter amount"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <Text style={styles.label}>Select Employment Type</Text>
        <TouchableOpacity
          style={styles.dropdownRow}
          activeOpacity={0.7}
          onPress={() => setActiveModal('employment')}>
          <Text style={[styles.dropdownText, !employmentType && styles.placeholderText]}>
            {employmentType || 'Select employment type'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.label}>PAN Number</Text>
        <TextInput
          style={styles.input}
          value={panNumber}
          onChangeText={text => setPanNumber(text.toUpperCase())}
          autoCapitalize="characters"
          maxLength={10}
          placeholder="ABCDE1234F"
          placeholderTextColor={colors.textSecondary}
        />

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={handleNext}>
          <Text style={styles.primaryButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>

      <RadioSelectModal
        visible={activeModal === 'day'}
        title="Select Day"
        options={DAYS}
        selectedValue={dobDay}
        onSelect={setDobDay}
        onClose={() => setActiveModal(null)}
      />
      <RadioSelectModal
        visible={activeModal === 'month'}
        title="Select Month"
        options={MONTHS}
        selectedValue={dobMonth}
        onSelect={setDobMonth}
        onClose={() => setActiveModal(null)}
      />
      <RadioSelectModal
        visible={activeModal === 'year'}
        title="Select Year"
        options={YEARS}
        selectedValue={dobYear}
        onSelect={setDobYear}
        onClose={() => setActiveModal(null)}
      />
      <RadioSelectModal
        visible={activeModal === 'gender'}
        title="Select Your Gender"
        options={GENDER_OPTIONS}
        selectedValue={gender}
        onSelect={setGender}
        onClose={() => setActiveModal(null)}
      />
      <RadioSelectModal
        visible={activeModal === 'marital'}
        title="Select Your Marital Status"
        options={MARITAL_STATUS_OPTIONS}
        selectedValue={maritalStatus}
        onSelect={setMaritalStatus}
        onClose={() => setActiveModal(null)}
      />
      <RadioSelectModal
        visible={activeModal === 'employment'}
        title="Select Employment Type"
        options={EMPLOYMENT_TYPE_OPTIONS}
        selectedValue={employmentType}
        onSelect={setEmploymentType}
        onClose={() => setActiveModal(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  placeholderText: {
    color: colors.textSecondary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryGreen,
    marginTop: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 20,
  },
  dobRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 20,
  },
  dobField: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dobText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 4,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 20,
  },
  rupee: {
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    padding: 0,
  },
  primaryButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PersonalInformationFormScreen;