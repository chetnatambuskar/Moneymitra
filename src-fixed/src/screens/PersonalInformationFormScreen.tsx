import React, {useState} from 'react';
import {
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
import {CURRENT_USER} from '../data/profile';
import {
  DOB_DAY_OPTIONS,
  DOB_MONTH_OPTIONS,
  DOB_YEAR_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PersonalInfoFormData,
} from '../data/loanForm';

type ActiveModal =
  | 'dobDay'
  | 'dobMonth'
  | 'dobYear'
  | 'gender'
  | 'marital'
  | 'employment'
  | null;

interface PersonalInformationFormScreenProps {
  initialData?: PersonalInfoFormData;
  onBack?: () => void;
  onNext?: (data: PersonalInfoFormData) => void;
}

const PersonalInformationFormScreen: React.FC<
  PersonalInformationFormScreenProps
> = ({initialData, onBack, onNext}) => {
  const [nameAsPerPan, setNameAsPerPan] = useState(
    initialData?.nameAsPerPan ?? CURRENT_USER.fullName,
  );
  const [dobDay, setDobDay] = useState(initialData?.dobDay ?? CURRENT_USER.dobDay);
  const [dobMonth, setDobMonth] = useState(initialData?.dobMonth ?? CURRENT_USER.dobMonth);
  const [dobYear, setDobYear] = useState(initialData?.dobYear ?? CURRENT_USER.dobYear);
  const [gender, setGender] = useState(initialData?.gender ?? CURRENT_USER.gender);
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [maritalStatus, setMaritalStatus] = useState(
    initialData?.maritalStatus ?? CURRENT_USER.maritalStatus,
  );
  const [loanAmount, setLoanAmount] = useState(initialData?.loanAmount ?? '50,000');
  const [employmentType, setEmploymentType] = useState(
    initialData?.employmentType ?? 'Self Employed',
  );
  const [panNumber, setPanNumber] = useState(initialData?.panNumber ?? '');

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const handleNext = () => {
    onNext?.({
      nameAsPerPan,
      dobDay,
      dobMonth,
      dobYear,
      gender,
      email,
      maritalStatus,
      loanAmount,
      employmentType,
      panNumber,
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
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Enter Your DOB</Text>
        <View style={styles.dobRow}>
          <TouchableOpacity
            style={styles.dobField}
            activeOpacity={0.7}
            onPress={() => setActiveModal('dobDay')}>
            <Text style={styles.dobText}>{dobDay}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dobField}
            activeOpacity={0.7}
            onPress={() => setActiveModal('dobMonth')}>
            <Text style={styles.dobText}>{dobMonth}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dobField}
            activeOpacity={0.7}
            onPress={() => setActiveModal('dobYear')}>
            <Text style={styles.dobText}>{dobYear}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Select Your Gender</Text>
        <TouchableOpacity
          style={styles.dropdownRow}
          activeOpacity={0.7}
          onPress={() => setActiveModal('gender')}>
          <Text style={styles.dropdownText}>{gender}</Text>
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
          <Text style={styles.dropdownText}>{maritalStatus}</Text>
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
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <Text style={styles.label}>Select Employment Type</Text>
        <TouchableOpacity
          style={styles.dropdownRow}
          activeOpacity={0.7}
          onPress={() => setActiveModal('employment')}>
          <Text style={styles.dropdownText}>{employmentType}</Text>
          <Ionicons name="chevron-down" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.label}>PAN Number</Text>
        <TextInput
          style={styles.input}
          value={panNumber}
          onChangeText={text => setPanNumber(text.toUpperCase())}
          autoCapitalize="characters"
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
        visible={activeModal === 'dobDay'}
        title="Select Day"
        options={DOB_DAY_OPTIONS}
        selectedValue={dobDay}
        onSelect={setDobDay}
        onClose={() => setActiveModal(null)}
      />
      <RadioSelectModal
        visible={activeModal === 'dobMonth'}
        title="Select Month"
        options={DOB_MONTH_OPTIONS}
        selectedValue={dobMonth}
        onSelect={setDobMonth}
        onClose={() => setActiveModal(null)}
      />
      <RadioSelectModal
        visible={activeModal === 'dobYear'}
        title="Select Year"
        options={DOB_YEAR_OPTIONS}
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
